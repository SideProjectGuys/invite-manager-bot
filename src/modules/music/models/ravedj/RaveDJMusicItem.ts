import { BaseInfo, MusicItem } from '../MusicItem';
import { MusicPlatform } from '../MusicPlatform';

import { RaveDJ } from './RaveDJ';
import { Medium } from './types';

interface Info extends BaseInfo {
	artist: string;
	audioUrl: string;
	duration: number;
	medias: Medium[];
}

export class RaveDJMusicItem extends MusicItem {
	protected platform: RaveDJ;

	public artist: string;
	public audioUrl: string;
	public duration: number;
	public medias: Medium[];

	public constructor(platform: MusicPlatform, info: Info) {
		super(platform, info);

		this.duration = info.duration;
		this.artist = info.artist;
		this.audioUrl = info.audioUrl;
		this.medias = info.medias;
	}

	public toSearchEntry(index: number): { name: string; value: string } {
		return {
			name: `\`${index}\`: ${this.title} **${this.duration}**`,
			value: `Link: ${this.link}`
		};
	}
	public toQueueEntry() {
		const obj = super.toQueueEntry();
		const time = this.platform.service.formatTime(this.duration);
		obj.value += ` | Duration: ${time}`;
		return obj;
	}

	public async getStreamUrl() {
		return this.audioUrl;
	}

	public toEmbed() {
		const obj = super.toEmbed();
		obj.fields = obj.fields.concat([
			{
				name: 'Duration',
				value: this.platform.service.formatTime(this.duration)
			},
			{
				name: 'Songs contained',
				value: this.medias
					.slice(0, 10) // TODO
					.map((medium, index) => `${index}: [${medium.title}](https://youtube.com/watch?v=${medium.providerId})`)
					.join('\n')
			}
		]);
		return obj;
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

	protected doClone(): RaveDJMusicItem {
		return new RaveDJMusicItem(this.platform, this);
	}
}
