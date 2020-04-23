import { platforms } from '../decorators/Platform';
import { MusicService } from '../services/Music';

import { MusicItem } from './MusicItem';

export abstract class MusicPlatform {
	private _name: string;
	public get name(): string {
		return this._name;
	}
	public abstract supportsRewind: boolean;
	public abstract supportsSeek: boolean;
	public abstract supportsLyrics: boolean;
	public abstract supportsSearch: boolean;

	public readonly service: MusicService;

	public constructor(service: MusicService) {
		this.service = service;
		this._name = [...platforms.entries()].find(([, constr]) => constr === this.constructor)[0];
	}

	public abstract isPlatformUrl(url: string): boolean;
	public abstract getByLink(link: string): Promise<MusicItem>;
	public abstract search(searchTerm: string, maxResults?: number): Promise<Array<MusicItem>>;
}
