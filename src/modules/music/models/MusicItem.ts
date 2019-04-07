import { User } from 'eris';

import { MusicQueueItem } from '../../../types';

import { MusicPlatform } from './MusicPlatform';

export interface BaseInfo {
	id: string;
	title: string;
	link: string;
	imageUrl: string;
}

export abstract class MusicItem {
	protected platform: MusicPlatform;

	public id: string;
	public title: string;
	public link: string;
	public imageUrl: string;

	public constructor(platform: MusicPlatform, info: BaseInfo) {
		this.platform = platform;
		this.id = info.id;
		this.title = info.title;
		this.link = info.link;
		this.imageUrl = info.imageUrl;
	}

	public abstract toSearchEntry(index: number): { name: string; value: string };
	public abstract toQueueItem(author: User): Promise<MusicQueueItem>;
}
