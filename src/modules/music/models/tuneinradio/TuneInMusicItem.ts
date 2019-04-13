import axios from 'axios';
import { User } from 'eris';

import { MusicPlatformTypes, MusicQueueItem } from '../../../../types';
import { BaseInfo, MusicItem } from '../MusicItem';
import { MusicPlatform } from '../MusicPlatform';

import { TuneInRadio } from './TuneInRadio';

const RADIO_TIME_URL = `https://opml.radiotime.com/Tune.ashx?render=json&id=`;

interface RadioInfo extends BaseInfo {
	description: string;
}

export class TuneInMusicItem extends MusicItem {
	protected platform: TuneInRadio;
	private description: string;

	public constructor(platform: MusicPlatform, info: RadioInfo) {
		super(platform, info);

		this.description = info.description;
	}

	public toSearchEntry(index: number): { name: string; value: string } {
		return {
			name: `\`${index}\`: ${this.title}`,
			value: `${this.description}`
		};
	}

	public async toQueueItem(author: User): Promise<MusicQueueItem> {
		const res = await axios.get(`${RADIO_TIME_URL}${this.id}`);

		return {
			id: this.id,
			title: this.title,
			imageURL: this.imageUrl,
			user: author,
			link: this.link,
			platform: MusicPlatformTypes.YouTube,
			getStreamUrl: async () => res.data.body[0].url,
			duration: 0,
			extras: []
		};
	}
}
