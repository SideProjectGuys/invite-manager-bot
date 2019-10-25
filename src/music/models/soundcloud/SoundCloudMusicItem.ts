import axios from 'axios';

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

	public artist: string;
	public audioUrl: string;
	public duration: number;

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
	public toQueueEntry() {
		const obj = super.toQueueEntry();
		const time = this.platform.service.formatTime(this.duration);
		obj.value += ` | Duration: ${time}`;
		return obj;
	}

	public async getStreamUrl() {
		const redir = await axios.get(this.audioUrl);
		return redir.request.res.responseUrl;
	}

	public toEmbed() {
		const base = super.toEmbed();
		base.fields = base.fields.concat([
			{
				name: 'Duration',
				value: this.platform.service.formatTime(this.duration / 1000)
			},
			{ name: 'Artist', value: this.artist }
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

	protected doClone(): SoundcloudMusicItem {
		return new SoundcloudMusicItem(this.platform, this);
	}
}
