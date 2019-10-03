import { Cache } from '../../../framework/cache/Cache';
import { StrikeConfig } from '../../../models/StrikeConfig';

export class StrikesCache extends Cache<StrikeConfig[]> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<StrikeConfig[]> {
		return await this.client.repo.strikeConfig.find({
			where: { guildId },
			order: { amount: 'DESC' }
		});
	}
}
