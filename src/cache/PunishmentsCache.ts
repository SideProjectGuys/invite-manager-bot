import { PunishmentConfigInstance, punishmentConfigs } from '../sequelize';

import { Cache } from './Cache';

export class PunishmentCache extends Cache<PunishmentConfigInstance[]> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<PunishmentConfigInstance[]> {
		return await punishmentConfigs.findAll({
			where: {
				guildId
			}
		});
	}
}
