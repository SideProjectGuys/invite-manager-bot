import { Cache } from './Cache';
import moment from 'moment';

export abstract class GuildCache<CachedObject> extends Cache<CachedObject> {
	public async init() {
		const it = this.client.guilds.keys();

		const guildIds: string[] = [];
		let result = it.next();

		while (!result.done) {
			const id = result.value as string;
			guildIds.push(id);

			this.cache.set(id, this.initOne(id));
			this.cacheTime.set(id, moment());

			result = it.next();
		}

		await this.getAll(guildIds);
	}

	protected abstract initOne(guildId: string): CachedObject;
	protected abstract async getAll(guildIds: string[]): Promise<void>;
}
