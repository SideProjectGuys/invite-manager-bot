import { IMCache } from '../../framework/cache/Cache';
import { PunishmentConfig } from '../models/PunishmentConfig';

export class PunishmentCache extends IMCache<PunishmentConfig[]> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<PunishmentConfig[]> {
		return this.db.getPunishmentConfigsForGuild(guildId);
	}
}
