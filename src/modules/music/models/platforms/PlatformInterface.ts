import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { MusicPlatform, MusicQueueItem } from '../../../../types';

export interface EmbedField {
	name: string;
	value: string;
}

export abstract class Platform {
	protected client: IMClient;

	public constructor(client: IMClient) {
		this.client = client;
	}

	public abstract isPlatformUrl(url: string): boolean;
	public abstract getPlatform(): MusicPlatform;
	public abstract getVideoInfoForUrl(
		message: Message,
		link: string
	): Promise<MusicQueueItem>;

	public search(searchTerm: string, maxResults?: number): Promise<any> {
		return Promise.resolve([]);
	}
}
