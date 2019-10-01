import { Cache } from '../../../framework/cache/Cache';
import { StrikeConfigInstance, strikeConfigs } from '../../../sequelize';

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
