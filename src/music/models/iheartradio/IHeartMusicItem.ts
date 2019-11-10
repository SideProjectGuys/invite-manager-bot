import { BaseInfo, MusicItem } from '../MusicItem';
import { MusicPlatform } from '../MusicPlatform';

import { IHeartRadio } from './IHeartRadio';

const iheart = require('iheart');

interface Info extends BaseInfo {
	station: any;
}

export class IHeartMusicItem extends MusicItem {
	protected platform: IHeartRadio;

	public station: any;

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

	public getStreamUrl() {
		return iheart.streamURL(this.station);
	}

	public toEmbed() {
		const base = super.toEmbed();
		base.fields = base.fields.concat([
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
		]);
		return base;
	}

	public getProgress(time: number) {
		return '```\n' + this.platform.service.formatTime(time) + '\n```';
	}

	protected doClone(): IHeartMusicItem {
		return new IHeartMusicItem(this.platform, this);
	}
}
