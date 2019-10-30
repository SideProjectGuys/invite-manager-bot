import { IMClient } from '../../client';
import { MusicPlatformType } from '../../types';
import { MusicService } from '../services/MusicService';

import { MusicItem } from './MusicItem';

export abstract class MusicPlatform {
	public abstract supportsRewind: boolean;
	public abstract supportsSeek: boolean;
	public abstract supportsLyrics: boolean;
	public abstract supportsSearch: boolean;

	protected client: IMClient;
	public get service(): MusicService {
		return this.client.music;
	}

	public constructor(client: IMClient) {
		this.client = client;
	}

	public abstract isPlatformUrl(url: string): boolean;
	public abstract getType(): MusicPlatformType;

	public abstract getByLink(link: string): Promise<MusicItem>;
	public abstract search(searchTerm: string, maxResults?: number): Promise<Array<MusicItem>>;
}
