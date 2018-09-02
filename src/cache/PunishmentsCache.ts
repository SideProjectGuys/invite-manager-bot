import { Cache } from './Cache';
import { PunishmentConfigInstance, punishmentConfigs } from '../sequelize';

export class PunishmentCache extends Cache<PunishmentConfigInstance[]> {
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

	protected async getOne(guildId: string): Promise<PunishmentConfigInstance[]> {
		return await punishmentConfigs.findAll({
			where: {
				guildId
			}
		});
	}
}
