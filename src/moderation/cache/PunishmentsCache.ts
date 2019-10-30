import { Cache } from '../../framework/cache/Cache';
import { PunishmentConfig } from '../../models/PunishmentConfig';

export class PunishmentCache extends Cache<PunishmentConfig[]> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<PunishmentConfig[]> {
		return await this.client.repo.punishmentConfig.find({ where: { guildId } });
	}
}
