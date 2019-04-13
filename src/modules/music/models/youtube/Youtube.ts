import axios from 'axios';
import { URLSearchParams } from 'url';
import ytdl from 'ytdl-core';

import { IMClient } from '../../../../client';
import { MusicPlatformTypes } from '../../../../types';
import { MusicItem } from '../MusicItem';
import { MusicPlatform } from '../MusicPlatform';

import { YoutubeMusicItem } from './YoutubeMusicItem';

interface YoutubeVideo {
	id: string;
	videoId?: string;
	contentDetails: {
		duration: string;
	};
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

export class Youtube extends MusicPlatform {
	public supportsRewind: boolean = true;
	public supportsSeek: boolean = true;
	public supportsLyrics: boolean = true;
	public supportsSearch: boolean = true;

	public constructor(client: IMClient) {
		super(client);
	}

	public isPlatformUrl(url: string): boolean {
		return url.startsWith('https://youtube.com/');
	}

	public getPlatform(): MusicPlatformTypes {
		return MusicPlatformTypes.YouTube;
	}

	public async getByLink(link: string): Promise<MusicItem> {
		const videoInfo = await ytdl.getInfo(link);
		if (!videoInfo) {
			throw new Error('INVALID_PLATFORM_URL');
		}

		return new YoutubeMusicItem(this, {
			id: videoInfo.video_id,
			title: videoInfo.player_response.videoDetails.title,
			link: `https://youtube.com/watch?v=${videoInfo.video_id}`,
			imageUrl: videoInfo.thumbnail_url,
			channel: videoInfo.author.name,
			duration: Number(videoInfo.length_seconds)
		});
	}

	public async search(
		searchTerm: string,
		maxResults: number = 10
	): Promise<Array<MusicItem>> {
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

		const details = await this.getVideoDetails(
			data.items.map((item: any) => item.id.videoId).join(',')
		);

		return details.map(
			detail =>
				new YoutubeMusicItem(this, {
					id: detail.id,
					title: detail.snippet.title,
					link: `https://youtube.com/watch?v=${detail.id}`,
					imageUrl: detail.snippet.thumbnails.default.url,
					channel: detail.snippet.channelTitle,
					duration: this.parseYoutubeDuration(detail.contentDetails.duration)
				})
		);
	}

	private async getVideoDetails(idList: string): Promise<Array<YoutubeVideo>> {
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

		return data.items;
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
