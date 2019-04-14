import { User } from 'eris';

import { MusicPlatformTypes, MusicQueueItem } from '../../../../types';
import { BaseInfo, MusicItem } from '../MusicItem';
import { MusicPlatform } from '../MusicPlatform';

import { Youtube } from './Youtube';

interface VideoInfo extends BaseInfo {
	channel: string;
	duration: number;
}

export class YoutubeMusicItem extends MusicItem {
	protected platform: Youtube;
	public channel: string;
	public duration: number;

	public constructor(platform: MusicPlatform, info: VideoInfo) {
		super(platform, info);

		this.duration = info.duration;
		this.channel = info.channel;
	}

	public toSearchEntry(index: number): { name: string; value: string } {
		return {
			name: `\`${index}\`: ${this.title} **${this.platform.service.formatTime(this.duration)}**`,
			value: `Uploader: ${this.channel}`
		};
	}

	public async toQueueItem(author: User): Promise<MusicQueueItem> {
		return {
			id: this.id,
			title: this.title,
			imageURL: this.imageUrl,
			user: author,
			link: this.link,
			platform: MusicPlatformTypes.YouTube,
			getStreamUrl: async () => this.link,
			duration: this.duration,
			extras: [
				{
					name: 'Duration',
					value: this.platform.service.formatTime(this.duration)
				},
				{ name: 'Channel', value: this.channel }
			]
		};
	}
}
