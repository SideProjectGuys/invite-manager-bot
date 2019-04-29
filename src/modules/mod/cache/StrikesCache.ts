import { StrikeConfigInstance, strikeConfigs } from '../../../sequelize';

import { Cache } from '../../../framework/cache/Cache';

export class StrikesCache extends Cache<StrikeConfigInstance[]> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<StrikeConfigInstance[]> {
		return await strikeConfigs.findAll({
			where: {
				guildId
			},
			order: [['amount', 'DESC']]
		});
	}
}
