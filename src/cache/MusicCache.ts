import { MusicQueue } from '../types';

import { GuildCache } from './GuildCache';

export class MusicCache extends GuildCache<MusicQueue> {
	protected initOne(guildId: string): MusicQueue {
		return {
			current: null,
			queue: []
		};
	}

	protected async _get(guildId: string): Promise<MusicQueue> {
		return this.cache.get(guildId);
	}
}
