import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { MusicPlatform, MusicQueueItem } from '../../../../types';

import { Platform } from './PlatformInterface';

const ytdl = require('ytdl-core');

export class Youtube implements Platform {
	public constructor() {}

	public isPlatformUrl(url: string): boolean {
		return url.startsWith('https://youtube.com/');
	}

	public getPlatform(): MusicPlatform {
		return MusicPlatform.YouTube;
	}

	public async getVideoInfoForUrl(
		client: IMClient,
		message: Message,
		link: string
	): Promise<MusicQueueItem> {
		const videoInfo = await ytdl.getInfo(link);
		if (!videoInfo) {
			throw new Error('INVALID_PLATFORM_URL');
		}

		return {
			title: videoInfo.player_response.videoDetails.title,
			imageURL: videoInfo.thumbnail_url,
			user: message.author,
			link: link,
			platform: MusicPlatform.YouTube,
			getStream: () => ytdl(link, { filter: 'audioonly' }),
			duration: Number(videoInfo.length_seconds),
			extras: [
				{
					name: 'Duration',
					value: client.music.formatTime(videoInfo.length_seconds)
				},
				{ name: 'Channel', value: videoInfo.author.name }
			]
		};
	}
}
