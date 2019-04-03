import axios from 'axios';
import { Message } from 'eris';
import { URLSearchParams } from 'url';
import ytdl from 'ytdl-core';

import { IMClient } from '../../../../client';
import { MusicPlatform, MusicQueueItem } from '../../../../types';

import { EmbedField, Platform } from './PlatformInterface';

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

export class Youtube extends Platform {
	public constructor(client: IMClient) {
		super(client);
	}

	public isPlatformUrl(url: string): boolean {
		return url.startsWith('https://youtube.com/');
	}

	public getPlatform(): MusicPlatform {
		return MusicPlatform.YouTube;
	}

	public async getVideoInfoForUrl(
		message: Message,
		link: string
	): Promise<MusicQueueItem> {
		const videoInfo = await ytdl.getInfo(link);
		if (!videoInfo) {
			throw new Error('INVALID_PLATFORM_URL');
		}

		return {
			id: videoInfo.video_id,
			title: videoInfo.player_response.videoDetails.title,
			imageURL: videoInfo.thumbnail_url,
			user: message.author,
			link: link,
			platform: MusicPlatform.YouTube,
			getStream: async () => ytdl(link, { filter: 'audioonly' }),
			duration: Number(videoInfo.length_seconds),
			extras: [
				{
					name: 'Duration',
					value: this.client.music.formatTime(Number(videoInfo.length_seconds))
				},
				{ name: 'Channel', value: videoInfo.author.name }
			]
		};
	}

	public async search(
		searchTerm: string,
		maxResults?: number
	): Promise<{ items: Array<YoutubeVideo> }> {
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
}
