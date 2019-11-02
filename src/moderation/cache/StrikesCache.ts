import { Cache } from '../../framework/cache/Cache';
import { StrikeConfig } from '../models/StrikeConfig';

export class StrikesCache extends Cache<StrikeConfig[]> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<StrikeConfig[]> {
		return this.client.db.getStrikeConfigsForGuild(guildId);
	}
}
