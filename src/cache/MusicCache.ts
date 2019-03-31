import { MusicQueue } from '../types';

import { Cache } from './Cache';

export class MusicCache extends Cache<MusicQueue> {
	public async init() {
		this.client.guilds.forEach(g =>
			this.cache.set(
				g.id,
				this.cache.get(g.id) || {
					current: null,
					queue: []
				}
			)
		);
	}

	protected async _get(guildId: string): Promise<MusicQueue> {
		return this.cache.get(guildId);
	}
}
