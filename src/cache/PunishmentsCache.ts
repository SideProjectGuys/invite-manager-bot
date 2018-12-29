import { PunishmentConfigInstance, punishmentConfigs } from '../sequelize';

import { GuildCache } from './GuildCache';

export class PunishmentCache extends GuildCache<PunishmentConfigInstance[]> {
	protected initOne(guildId: string): PunishmentConfigInstance[] {
		return [];
	}

	protected async getAll(guildIds: string[]): Promise<void> {
		const cfgs = await punishmentConfigs.findAll({
			where: {
				guildId: guildIds
			}
		});

		cfgs.forEach(cfg => {
			this.cache.get(cfg.guildId).push(cfg);
		});
	}

	protected async _get(guildId: string): Promise<PunishmentConfigInstance[]> {
		return await punishmentConfigs.findAll({
			where: {
				guildId
			}
		});
	}
}
