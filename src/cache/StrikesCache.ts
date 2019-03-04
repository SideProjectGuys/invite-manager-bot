import { StrikeConfigInstance, strikeConfigs } from '../sequelize';

import { GuildCache } from './GuildCache';

export class StrikesCache extends GuildCache<StrikeConfigInstance[]> {
	protected initOne(guildId: string): StrikeConfigInstance[] {
		return [];
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
