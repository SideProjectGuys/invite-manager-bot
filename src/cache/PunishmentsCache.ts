import { PunishmentConfigInstance, punishmentConfigs } from '../sequelize';

import { GuildCache } from './GuildCache';

export class PunishmentCache extends GuildCache<PunishmentConfigInstance[]> {
	protected initOne(guildId: string): PunishmentConfigInstance[] {
		return [];
	}

	protected async _get(guildId: string): Promise<PunishmentConfigInstance[]> {
		return await punishmentConfigs.findAll({
			where: {
				guildId
			}
		});
	}
}
