import axios from 'axios';
import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { MusicPlatform, MusicQueueItem } from '../../../../types';

import { EmbedField, Platform } from './PlatformInterface';

const SOUNDCLOUD_CLIENT_ID = 'z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF';

export class Soundcloud extends Platform {
	public constructor(client: IMClient) {
		super(client);
	}

	public isPlatformUrl(url: string): boolean {
		return url.startsWith('https://soundcloud.com');
	}

	public getPlatform(): MusicPlatform {
		return MusicPlatform.SoundCloud;
	}

	public async getVideoInfoForUrl(
		message: Message,
		link: string
	): Promise<MusicQueueItem> {
		const scLink = `http://api.soundcloud.com/resolve?url=${link}&client_id=${SOUNDCLOUD_CLIENT_ID}`;
		const scData = (await axios.get(scLink)).data;

		if (scData.kind !== 'track') {
			throw new Error('INVALID_PLATFORM_URL');
		}

		// Resolve redirect
		const redir = await axios.get(
			`${scData.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}`
		);

		return {
			id: link,
			title: scData.title,
			imageURL: scData.artwork_url,
			user: message.author,
			link,
			platform: MusicPlatform.SoundCloud,
			getStream: () => redir.request.res.responseUrl,
			duration: scData.duration,
			extras: [
				{
					name: 'Duration',
					value: this.client.music.formatTime(scData.duration / 1000)
				},
				{ name: 'Artist', value: scData.user.username }
			]
		};
	}

	public async search(
		searchTerm: string,
		maxResults?: number
	): Promise<EmbedField[]> {
		const scLink = `http://api.soundcloud.com/tracks?q=${searchTerm}&client_id=${SOUNDCLOUD_CLIENT_ID}`;
		const scData = (await axios.get(scLink)).data;

		return scData.map((item: any, index: number) => ({
			name: `${index}: ${item.title}`,
			value: `${item.duration}`
		}));
	}
}
