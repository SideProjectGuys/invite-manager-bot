import axios from 'axios';
import { User } from 'eris';

import { MusicPlatformTypes, MusicQueueItem } from '../../../../types';
import { BaseInfo, MusicItem } from '../MusicItem';
import { MusicPlatform } from '../MusicPlatform';

import { Soundcloud } from './SoundCloud';

interface Info extends BaseInfo {
	artist: string;
	audioUrl: string;
	duration: number;
}

export class SoundcloudMusicItem extends MusicItem {
	protected platform: Soundcloud;
	private artist: string;
	private audioUrl: string;
	private duration: number;

	public constructor(platform: MusicPlatform, info: Info) {
		super(platform, info);

		this.duration = info.duration;
		this.audioUrl = info.audioUrl;
		this.artist = info.artist;
	}

	public toSearchEntry(index: number): { name: string; value: string } {
		return {
			name: `\`${index}\`: ${this.title} **${this.duration}**`,
			value: `Uploader: ${this.artist}`
		};
	}

	public async toQueueItem(author: User): Promise<MusicQueueItem> {
		// Resolve redirect
		const redir = await axios.get(this.audioUrl);

		return {
			id: this.id,
			title: this.title,
			imageURL: this.imageUrl,
			user: author,
			link: this.link,
			platform: MusicPlatformTypes.SoundCloud,
			getStream: async () => redir.request.res.responseUrl,
			duration: this.duration,
			extras: [
				{
					name: 'Duration',
					value: this.platform.service.formatTime(this.duration / 1000)
				},
				{ name: 'Artist', value: this.artist }
			]
		};
	}
}
