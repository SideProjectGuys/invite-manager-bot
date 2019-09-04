import axios from 'axios';
import { Guild } from 'eris';
import xmldoc, { XmlElement } from 'xmldoc';

import { IMClient } from '../../../client';
import { AnnouncementVoice, musicNodes } from '../../../sequelize';
import { BotType, LavaTrack } from '../../../types';
import { MusicCache } from '../cache/MusicCache';
import { MusicConnection } from '../models/MusicConnection';
import { MusicItem } from '../models/MusicItem';

import { MusicPlatformService } from './MusicPlatformService';

const { PlayerManager } = require('eris-lavalink');

const ALPHA_INDEX: { [x: string]: string } = {
	'&lt': '<',
	'&gt': '>',
	'&quot': '"',
	'&apos': `'`,
	'&amp': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&apos;': `'`,
	'&amp;': '&'
};

interface MusicNode {
	host: string;
	port: number;
	region: string;
	password: string;
}

export class MusicService {
	public client: IMClient;
	public cache: MusicCache;
	private nodes: MusicNode[] = [];

	public platforms: MusicPlatformService;
	private musicConnections: Map<string, MusicConnection>;

	public getMusicConnectionGuildIds() {
		return [...this.musicConnections.keys()];
	}

	public constructor(client: IMClient) {
		this.client = client;
		this.cache = client.cache.music;

		this.platforms = new MusicPlatformService(client);
		this.musicConnections = new Map();

		this.client.on('ready', this.onClientReady.bind(this));
	}

	private async onClientReady() {
		if (this.client.hasStarted) {
			return;
		}

		await this.loadMusicNodes();
	}

	public async loadMusicNodes() {
		// Load nodes from database
		const typeFilter =
			this.client.type === BotType.custom
				? 'isCustom'
				: this.client.type === BotType.pro
				? 'isPremium'
				: 'isRegular';
		this.nodes = await musicNodes.findAll({
			where: { [typeFilter]: true },
			raw: true
		});

		// Setup connections
		this.client.voiceConnections = new PlayerManager(this.client, this.nodes, {
			numShards: 1,
			userId: this.client.user.id,
			defaultRegion: 'eu',
			failoverLimit: 2
		});
	}

	public async getMusicConnection(guild: Guild) {
		let conn = this.musicConnections.get(guild.id);
		if (!conn) {
			conn = new MusicConnection(this, guild, await this.cache.get(guild.id));
			this.musicConnections.set(guild.id, conn);
		}
		return conn;
	}

	public createPlayingEmbed(item: MusicItem) {
		if (!item) {
			return this.client.msg.createEmbed({
				author: null,
				title: 'Not playing',
				fields: []
			});
		}

		const embed = this.client.msg.createEmbed(item.toEmbed());
		embed.author = {
			name: `${item.author.username}#${item.author.discriminator}`,
			icon_url: item.author.avatarURL
		};
		return embed;
	}

	public async getLyrics(item: MusicItem) {
		const { data } = await axios.get(
			`http://video.google.com/timedtext?lang=en&v=${item.id}`
		);

		const lyrics: { start: number; dur: number; text: string }[] = [];
		try {
			const doc = new xmldoc.XmlDocument(data);

			doc.children.forEach((txt: XmlElement) => {
				lyrics.push({
					start: Number(txt.attr.start),
					dur: Number(txt.attr.dur),
					text: this.decodeHTMLEntities(txt.val)
				});
			});

			return lyrics;
		} catch (error) {
			return [];
		}
	}

	private decodeHTMLEntities(str: string) {
		return str.replace(/&#?[0-9a-zA-Z]+;?/g, s => {
			if (s.charAt(1) === '#') {
				const code =
					s.charAt(2).toLowerCase() === 'x'
						? parseInt(s.substr(3), 16)
						: parseInt(s.substr(2), 10);

				if (isNaN(code) || code < -32768 || code > 65535) {
					return '';
				}
				return String.fromCharCode(code);
			}
			return ALPHA_INDEX[s] || s;
		});
	}

	public formatTime(timeInSeconds: number) {
		const h = Math.floor(timeInSeconds / 3600);
		const m = Math.floor((timeInSeconds - 3600 * h) / 60);
		const s = Math.floor(timeInSeconds - h * 3600 - m * 60);

		const durationParts = [];

		if (h > 0) {
			durationParts.push(h.toString().padStart(2, '0'));
		}

		durationParts.push(m.toString().padStart(2, '0'));
		durationParts.push(s.toString().padStart(2, '0'));

		return durationParts.join(':');
	}

	public async getAnnouncementUrl(voice: AnnouncementVoice, message: string) {
		const msg = encodeURIComponent(message);
		const baseUrl = this.client.config.bot.music.pollyUrl;
		return `${baseUrl}/synth/${voice}?message=${msg}`;
	}

	public async resolveTracks(url: string) {
		if (this.nodes.length === 0) {
			throw new Error('There are currently no music nodes available');
		}

		const baseUrl = `http://${this.nodes[0].host}:${this.nodes[0].port}`;
		const { data } = await axios.get<{ tracks: LavaTrack[] }>(
			`${baseUrl}/loadtracks?identifier=${encodeURIComponent(url)}`,
			{
				headers: {
					Authorization: this.nodes[0].password,
					Accept: 'application/json'
				}
			}
		);
		return data.tracks;
	}
}
