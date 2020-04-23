import { IMCache } from '../../framework/cache/Cache';
import { MusicQueue } from '../models/MusicQueue';

export class MusicCache extends IMCache<MusicQueue> {
	public async init() {
		this.client.guilds.forEach((g) => this.cache.set(g.id, this.cache.get(g.id) || new MusicQueue()));
	}

	protected async _get(guildId: string): Promise<MusicQueue> {
		return new MusicQueue();
	}
}
