import { EmbedOptions } from 'eris';

import { BasicUser } from '../../types';

import { MusicPlatform } from './MusicPlatform';

export interface BaseInfo {
	id: string;
	title: string;
	link: string;
	imageUrl: string;
}

export abstract class MusicItem {
	protected platform: MusicPlatform;
	public getPlatform() {
		return this.platform;
	}

	public id: string;
	public title: string;
	public link: string;
	public imageUrl: string;
	public author: BasicUser;

	public constructor(platform: MusicPlatform, info: BaseInfo) {
		this.platform = platform;
		this.id = info.id;
		this.title = info.title;
		this.link = info.link;
		this.imageUrl = info.imageUrl;
	}

	public setAuthor(author: BasicUser) {
		this.author = author;
	}

	public abstract async getStreamUrl(): Promise<string>;

	public toSearchEntry(index: number): { name: string; value: string } {
		return {
			name: `${index}. ${this.title}`,
			value: ''
		};
	}
	public toQueueEntry(): { name: string; value: string } {
		return {
			name: this.title,
			value: `Added by: ${this.author.username}`
		};
	}
	public toEmbed(): EmbedOptions {
		return {
			url: this.link,
			image: { url: this.imageUrl },
			title: this.title,
			fields: []
		};
	}
	public abstract getProgress(time: number): string;

	public clone(): MusicItem {
		const item = this.doClone();
		item.setAuthor(this.author);
		return item;
	}
	protected abstract doClone(): MusicItem;

	public toString() {
		return this.platform.getType() + ':' + this.id;
	}
}
