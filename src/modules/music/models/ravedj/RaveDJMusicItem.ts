import { User } from 'eris';

import { MusicPlatformTypes, MusicQueueItem } from '../../../../types';
import { BaseInfo, MusicItem } from '../MusicItem';
import { MusicPlatform } from '../MusicPlatform';

import { Medium, RaveDJ } from './RaveDJ';

interface Info extends BaseInfo {
	artist: string;
	audioUrl: string;
	duration: number;
	medias: Medium[];
}

export class RaveDJMusicItem extends MusicItem {
	protected platform: RaveDJ;
	private artist: string;
	private audioUrl: string;
	private duration: number;
	private media: Medium[];

	public constructor(platform: MusicPlatform, info: Info) {
		super(platform, info);

		this.duration = info.duration;
		this.artist = info.artist;
		this.audioUrl = info.audioUrl;
		this.media = info.medias;
	}

	public toSearchEntry(index: number): { name: string; value: string } {
		return {
			name: `\`${index}\`: ${this.title} **${this.duration}**`,
			value: `Link: ${this.link}`
		};
	}

	public async toQueueItem(author: User): Promise<MusicQueueItem> {
		return {
			id: this.id,
			title: `${this.artist} - ${this.title}`,
			imageURL: this.imageUrl,
			user: author,
			link: this.link,
			platform: MusicPlatformTypes.RaveDJ,
			duration: this.duration,
			getStreamUrl: async () => this.audioUrl,
			extras: [
				{
					name: 'Duration',
					value: this.platform.service.formatTime(this.duration)
				},
				{
					name: 'Songs contained',
					value: this.media
						.slice(0, 10) // TODO
						.map(
							(medium, index) =>
								`${index}: [${medium.title}](https://youtube.com/watch?v=${
									medium.providerId
								})`
						)
						.join('\n')
				}
			]
		};
	}
}
