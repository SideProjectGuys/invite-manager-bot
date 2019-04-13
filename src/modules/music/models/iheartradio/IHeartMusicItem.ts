import { User } from 'eris';

import { MusicPlatformTypes, MusicQueueItem } from '../../../../types';
import { BaseInfo, MusicItem } from '../MusicItem';
import { MusicPlatform } from '../MusicPlatform';

import { IHeartRadio } from './IHeartRadio';

const iheart = require('iheart');

interface Info extends BaseInfo {
	station: any;
}

export class IHeartMusicItem extends MusicItem {
	protected platform: IHeartRadio;

	private station: any;

	public constructor(platform: MusicPlatform, info: Info) {
		super(platform, info);

		this.station = info.station;
	}

	public toSearchEntry(index: number): { name: string; value: string } {
		return {
			name: `\`${index}\`: ${this.title}`,
			value: `Link: ${this.link}`
		};
	}

	public async toQueueItem(author: User): Promise<MusicQueueItem> {
		return {
			id: this.id,
			title: this.title,
			imageURL: this.imageUrl,
			user: author,
			link: this.link,
			platform: MusicPlatformTypes.iHeartRADIO,
			duration: 0,
			getStreamUrl: async () => iheart.streamURL(this.station),
			extras: [
				{
					name: 'Air',
					value: `${this.station.frequency} ${this.station.band}`,
					inline: true
				},
				{
					name: 'Location',
					value: `${this.station.city}, ${this.station.state}`,
					inline: true
				},
				{
					name: 'Description',
					value: this.station.description,
					inline: false
				}
			]
		};
	}
}
