import { IMClient } from '../../client';
import { MusicPlatformType } from '../../types';
import { MusicService } from '../services/Music';

import { MusicItem } from './MusicItem';

export abstract class MusicPlatform {
	public abstract supportsRewind: boolean;
	public abstract supportsSeek: boolean;
	public abstract supportsLyrics: boolean;
	public abstract supportsSearch: boolean;

	public readonly service: MusicService;

	public constructor(service: MusicService) {
		this.service = service;
	}

	public abstract isPlatformUrl(url: string): boolean;
	public abstract getType(): MusicPlatformType;

	public abstract getByLink(link: string): Promise<MusicItem>;
	public abstract search(searchTerm: string, maxResults?: number): Promise<Array<MusicItem>>;
}
