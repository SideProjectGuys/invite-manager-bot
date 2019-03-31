import AWS from 'aws-sdk';
import axios from 'axios';
import { Guild } from 'eris';
import { URLSearchParams } from 'url';

import { MusicCache } from '../cache/MusicCache';
import { IMClient } from '../../../client';
import { MusicQueueItem } from '../../../types';

import { MusicConnection } from '../models/MusicConnection';

interface YoutubeVideo {
	id: string;
	videoId?: string;
	contentDetails: YoutubeVideoContentDetails;
	snippet: {
		channelTitle: string;
		description: string;
		thumbnails: {
			default: {
				height: number;
				url: string;
				width: number;
			};
		};
		title: string;
	};
}

interface YoutubeVideoContentDetails {
	duration: string;
}

export class MusicService {
	public client: IMClient;
	public cache: MusicCache;
	public polly: AWS.Polly;

	private musicConnections: Map<string, MusicConnection>;

	public constructor(client: IMClient) {
		this.client = client;
		this.cache = client.cache.music;
		this.musicConnections = new Map();
		this.polly = new AWS.Polly({
			signatureVersion: 'v4',
			region: 'eu-central-1',
			credentials: client.config.bot.aws
		});
	}

	public async getMusicConnection(guild: Guild) {
		let conn = this.musicConnections.get(guild.id);
		if (!conn) {
			conn = new MusicConnection(this, guild, await this.cache.get(guild.id));
			const sets = await this.client.cache.settings.get(guild.id);
			conn.setVolume(sets.musicVolume);

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

	public async searchYoutube(searchTerm: string, maxResults?: number) {
		const params: URLSearchParams = new URLSearchParams();
		params.set('key', this.client.config.bot.youtubeApiKey);
		params.set('type', 'video');
		// params.set('videoEmbeddable', "true");
		// params.set('videoSyndicated', "true");
		params.set('videoCategoryId', '10'); // only music videos
		params.set('maxResults', (maxResults || 10).toString());
		params.set('part', 'id');
		params.set('fields', 'items(id(videoId))');
		params.set('q', searchTerm);

		const { data } = await axios(
			`https://www.googleapis.com/youtube/v3/search?${params}`
		);

		return this.getVideoDetails(
			data.items.map((item: any) => item.id.videoId).join(',')
		);
	}

	private async getVideoDetails(
		idList: string
	): Promise<{ items: Array<YoutubeVideo> }> {
		const params: URLSearchParams = new URLSearchParams();
		params.set('key', this.client.config.bot.youtubeApiKey);
		params.set('id', idList);
		params.set('part', 'contentDetails,snippet');
		params.set(
			'fields',
			'items(id,snippet(title,description,thumbnails(default),channelTitle),contentDetails(duration))'
		);

		const { data } = await axios(
			`https://www.googleapis.com/youtube/v3/videos?${params}`
		);

		return data;
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

	public parseYoutubeDuration(PT: string) {
		let durationInSec = 0;
		const matches = PT.match(
			/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i
		);
		const parts = [
			{
				// years
				pos: 1,
				multiplier: 86400 * 365
			},
			{
				// months
				pos: 2,
				multiplier: 86400 * 30
			},
			{
				// weeks
				pos: 3,
				multiplier: 604800
			},
			{
				// days
				pos: 4,
				multiplier: 86400
			},
			{
				// hours
				pos: 5,
				multiplier: 3600
			},
			{
				// minutes
				pos: 6,
				multiplier: 60
			},
			{
				// seconds
				pos: 7,
				multiplier: 1
			}
		];
		for (var i = 0; i < parts.length; i++) {
			if (typeof matches[parts[i].pos] !== 'undefined') {
				durationInSec +=
					parseInt(matches[parts[i].pos], 10) * parts[i].multiplier;
			}
		}
		return durationInSec;
	}
}
