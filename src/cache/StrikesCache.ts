import { StrikeConfigInstance, strikeConfigs } from '../sequelize';

import { GuildCache } from './GuildCache';

export class StrikesCache extends GuildCache<StrikeConfigInstance[]> {
	protected initOne(guildId: string): StrikeConfigInstance[] {
		return [];
	}

	protected async getAll(guildIds: string[]): Promise<void> {
		const cfgs = await strikeConfigs.findAll({
			where: {
				guildId: guildIds
			},
			order: [['amount', 'DESC']]
		});

		cfgs.forEach(cfg => {
			this.cache.get(cfg.guildId).push(cfg);
		});
	}

	protected async getOne(guildId: string): Promise<StrikeConfigInstance[]> {
		return await strikeConfigs.findAll({
			where: {
				guildId
			},
			order: [['amount', 'DESC']]
		});
	}
}
