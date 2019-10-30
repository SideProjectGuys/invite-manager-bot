import { Cache } from '../../framework/cache/Cache';
import { Rank } from '../../models/Rank';

export class RanksCache extends Cache<Rank[]> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<Rank[]> {
		return this.client.db.getRanksForGuild(guildId);
	}
}
