import { IMCache } from '../../framework/cache/Cache';
import { StrikeConfig } from '../models/StrikeConfig';

export class StrikesCache extends IMCache<StrikeConfig[]> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<StrikeConfig[]> {
		return this.db.getStrikeConfigsForGuild(guildId);
	}
}
