import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { MusicPlatform, MusicQueueItem } from '../../../../types';

import { Platform } from './PlatformInterface';

const iheart = require('iheart');

export class IHeartRadio extends Platform {
	public constructor(client: IMClient) {
		super(client);
	}

	public isPlatformUrl(url: string): boolean {
		return url.startsWith('iheart');
	}

	public getPlatform(): MusicPlatform {
		return MusicPlatform.iHeartRADIO;
	}

	public async getVideoInfoForUrl(
		message: Message,
		link: string
	): Promise<MusicQueueItem> {
		const search = link.substr(6).trim();

		const matches = await iheart.search(search);
		const station = matches.stations[0];

		return {
			id: null,
			title: station.name,
			imageURL: station.newlogo,
			user: message.author,
			platform: MusicPlatform.iHeartRADIO,
			duration: null,
			getStream: () => iheart.streamURL(station),
			extras: [
				{
					name: 'Air',
					value: `${station.frequency} ${station.band}`,
					inline: true
				},
				{
					name: 'Location',
					value: `${station.city}, ${station.state}`,
					inline: true
				},
				{
					name: 'Description',
					value: station.description,
					inline: false
				}
			]
		};
	}
}
