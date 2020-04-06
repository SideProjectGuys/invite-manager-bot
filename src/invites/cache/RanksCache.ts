import { IMCache } from '../../framework/cache/Cache';
import { Rank } from '../models/Rank';

export class RanksCache extends IMCache<Rank[]> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<Rank[]> {
		const ranks = await this.db.getRanksForGuild(guildId);
		return ranks.sort((a, b) => a.numInvites - b.numInvites);
	}
}
