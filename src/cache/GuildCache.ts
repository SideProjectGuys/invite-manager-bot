import { Cache } from './Cache';

export abstract class GuildCache<CachedObject> extends Cache<CachedObject> {
	public async init() {
		this.client.guilds.forEach(g => {
			this.cache.set(g.id, this.initOne(g.id));
		});
	}

	protected abstract initOne(guildId: string): CachedObject;
}
