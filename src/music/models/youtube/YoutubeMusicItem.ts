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

	public toSearchEntry(index: number) {
		return {
			name: `\`${index}\`: ${this.title} **${this.platform.service.formatTime(this.duration)}**`,
			value: `Uploader: ${this.channel}`
		};
	}
	public toQueueEntry() {
		const obj = super.toQueueEntry();
		const time = this.platform.service.formatTime(this.duration);
		obj.value += ` | Duration: ${time}`;
		return obj;
	}

	public async getStreamUrl() {
		return this.link;
	}

	public toEmbed() {
		const base = super.toEmbed();
		base.fields = base.fields.concat([
			{
				name: 'Duration',
				value: this.platform.service.formatTime(this.duration)
			},
			{ name: 'Channel', value: this.channel }
		]);
		return base;
	}

	public getProgress(time: number) {
		const progress = Math.max(0, Math.min(30, Math.round(30 * (time / this.duration))));
		return (
			'```\n[' +
			'='.repeat(progress) +
			' '.repeat(30 - progress) +
			'] ' +
			this.platform.service.formatTime(time) +
			' / ' +
			this.platform.service.formatTime(this.duration) +
			'\n```'
		);
	}

	protected doClone(): YoutubeMusicItem {
		return new YoutubeMusicItem(this.platform, this);
	}
}
