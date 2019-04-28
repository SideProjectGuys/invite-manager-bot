import axios from 'axios';
import { Guild, VoiceConnection, VoiceConnectionManager } from 'eris';
import xmldoc, { XmlElement } from 'xmldoc';

import { IMClient } from '../../../client';
import { AnnouncementVoice } from '../../../sequelize';
import { LavaTrack, MusicQueueItem } from '../../../types';
import { MusicCache } from '../cache/MusicCache';
import { MusicConnection } from '../models/MusicConnection';

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
	private nodes: MusicNode[];

	public platforms: MusicPlatformService;

	public oldConns: VoiceConnectionManager<VoiceConnection>;
	private musicConnections: Map<string, MusicConnection>;

	public constructor(client: IMClient) {
		this.client = client;
		this.nodes = client.config.bot.music.nodes;

		this.cache = client.cache.music;
		this.platforms = new MusicPlatformService(client);
		this.musicConnections = new Map();
	}

	public async init() {
		this.oldConns = this.client.voiceConnections;
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

	public createPlayingEmbed(item: MusicQueueItem) {
		if (!item) {
			return this.client.msg.createEmbed({
				author: { name: 'InvMan Music', icon_url: this.client.user.avatarURL },
				color: 255, // blue
				title: 'Not playing',
				fields: []
			});
		}

		return this.client.msg.createEmbed({
			author: {
				name: `${item.user.username}#${item.user.discriminator}`,
				icon_url: item.user.avatarURL
			},
			url: item.link,
			image: { url: item.imageURL },
			color: 255, // blue
			title: item.title,
			fields: [...item.extras]
		});
	}

	public async getLyrics(item: MusicQueueItem) {
		const { data } = await axios.get(
			`http://video.google.com/timedtext?lang=en&v=${item.id}`
		);

		const lyrics: { start: number; dur: number; text: string }[] = [];
		const doc = new xmldoc.XmlDocument(data);
		doc.children.forEach((txt: XmlElement) => {
			lyrics.push({
				start: Number(txt.attr.start),
				dur: Number(txt.attr.dur),
				text: this.decodeHTMLEntities(txt.val)
			});
		});

		return lyrics;
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
		return (
			h.toString().padStart(2, '0') +
			':' +
			m.toString().padStart(2, '0') +
			':' +
			s.toString().padStart(2, '0')
		);
	}

	public async getAnnouncementUrl(voice: AnnouncementVoice, message: string) {
		const msg = encodeURIComponent(message);
		const baseUrl = this.client.config.bot.music.pollyUrl;
		return `${baseUrl}/synth/${voice}?message=${msg}`;
	}

	public async resolveTracks(url: string) {
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
