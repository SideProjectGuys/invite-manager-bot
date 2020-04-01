import axios from 'axios';

import { IMClient } from '../../../client';
import { MusicPlatformType } from '../../../types';
import { MusicPlatform } from '../MusicPlatform';

import { SoundcloudMusicItem } from './SoundCloudMusicItem';
import { SoundcloudResponse } from './types';

const SOUNDCLOUD_CLIENT_ID = 'Vu5tlmvC9eCLFZkxXG32N1yQMfDSAPAA';

export class Soundcloud extends MusicPlatform {
	public supportsRewind: boolean = true;
	public supportsSeek: boolean = true;
	public supportsLyrics: boolean = false;
	public supportsSearch: boolean = true;

	public constructor(client: IMClient) {
		super(client);
	}

	public isPlatformUrl(url: string): boolean {
		if (!url) {
			return false;
		}
		return url.startsWith('https://soundcloud.com');
	}

	public getType(): MusicPlatformType {
		return MusicPlatformType.SoundCloud;
	}

	public async getByLink(link: string): Promise<SoundcloudMusicItem> {
		link = encodeURIComponent(link);
		const scLink = `http://api.soundcloud.com/resolve?url=${link}&client_id=${SOUNDCLOUD_CLIENT_ID}`;
		const scData: SoundcloudResponse = (await axios.get(scLink)).data;

		if (scData.kind !== 'track') {
			throw new Error('INVALID_PLATFORM_URL');
		}

		return new SoundcloudMusicItem(this, {
			id: scData.id.toString(),
			title: scData.title,
			link: scData.permalink_url,
			imageUrl: scData.artwork_url,
			artist: scData.user ? scData.user.username : '',
			audioUrl: `${scData.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}`,
			duration: scData.duration
		});
	}

	public async search(searchTerm: string, maxResults?: number): Promise<SoundcloudMusicItem[]> {
		searchTerm = encodeURIComponent(searchTerm);
		const scLink = `http://api.soundcloud.com/tracks?q=${searchTerm}&client_id=${SOUNDCLOUD_CLIENT_ID}`;
		const scData = (await axios.get(scLink)).data;

		return scData.map(
			(item: any, index: number) =>
				new SoundcloudMusicItem(this, {
					id: scData.id,
					title: scData.title,
					link: scData.permalink_url,
					imageUrl: scData.artwork_url,
					artist: scData.user ? scData.user.username : '',
					audioUrl: `${scData.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}`,
					duration: scData.duration
				})
		);
	}
}
