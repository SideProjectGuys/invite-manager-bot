import axios from 'axios';

import { BaseInfo, MusicItem } from '../MusicItem';
import { MusicPlatform } from '../MusicPlatform';

import { TuneInRadio } from './TuneInRadio';

const RADIO_TIME_URL = `https://opml.radiotime.com/Tune.ashx?render=json&id=`;

interface RadioInfo extends BaseInfo {
	description: string;
}

export class TuneInMusicItem extends MusicItem {
	protected platform: TuneInRadio;

	public description: string;

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

	public async getStreamUrl() {
		const res = await axios.get(`${RADIO_TIME_URL}${this.id}`);
		return res.data.body[0].url;
	}

	public getProgress(time: number) {
		return '```\n' + this.platform.service.formatTime(time) + '\n```';
	}

	protected doClone(): TuneInMusicItem {
		return new TuneInMusicItem(this.platform, this);
	}
}
