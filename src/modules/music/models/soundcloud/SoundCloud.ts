import axios from 'axios';

import { IMClient } from '../../../../client';
import { MusicPlatformTypes } from '../../../../types';
import { MusicPlatform } from '../MusicPlatform';

import { SoundcloudMusicItem } from './SoundCloudMusicItem';

const SOUNDCLOUD_CLIENT_ID = 'z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF';

interface SoundcloudResponse {
	kind: string;
	id: number;
	created_at: string;
	user_id: number;
	duration: number;
	commentable: boolean;
	state: string;
	original_content_size: number;
	last_modified: string;
	sharing: string;
	tag_list: string;
	permalink: string;
	streamable: boolean;
	embeddable_by: string;
	purchase_url?: any;
	purchase_title?: any;
	label_id?: any;
	genre: string;
	title: string;
	description: string;
	label_name?: any;
	release?: any;
	track_type?: any;
	key_signature?: any;
	isrc?: any;
	video_url?: any;
	bpm?: any;
	release_year?: any;
	release_month?: any;
	release_day?: any;
	original_format: string;
	license: string;
	uri: string;
	user: SoundcloudUser;
	permalink_url: string;
	artwork_url: string;
	stream_url: string;
	download_url: string;
	playback_count: number;
	download_count: number;
	favoritings_count: number;
	reposts_count: number;
	comment_count: number;
	downloadable: boolean;
	waveform_url: string;
	attachments_uri: string;
	policy: string;
	monetization_model: string;
}

interface SoundcloudUser {
	id: number;
	kind: string;
	permalink: string;
	username: string;
	last_modified: string;
	uri: string;
	permalink_url: string;
	avatar_url: string;
}

export class Soundcloud extends MusicPlatform {
	public supportsRewind: boolean = true;
	public supportsSeek: boolean = true;
	public supportsLyrics: boolean = false;
	public supportsSearch: boolean = true;

	public constructor(client: IMClient) {
		super(client);
	}

	public isPlatformUrl(url: string): boolean {
		return url.startsWith('https://soundcloud.com');
	}

	public getType(): MusicPlatformTypes {
		return MusicPlatformTypes.SoundCloud;
	}

	public async getByLink(link: string): Promise<SoundcloudMusicItem> {
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
			artist: scData.user.username,
			audioUrl: `${scData.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}`,
			duration: scData.duration
		});
	}

	public async search(
		searchTerm: string,
		maxResults?: number
	): Promise<SoundcloudMusicItem[]> {
		const scLink = `http://api.soundcloud.com/tracks?q=${searchTerm}&client_id=${SOUNDCLOUD_CLIENT_ID}`;
		const scData = (await axios.get(scLink)).data;

		return scData.map(
			(item: any, index: number) =>
				new SoundcloudMusicItem(this, {
					id: scData.id,
					title: scData.title,
					link: scData.permalink_url,
					imageUrl: scData.artwork_url,
					artist: scData.user.username,
					audioUrl: `${scData.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}`,
					duration: scData.duration
				})
		);
	}
}
