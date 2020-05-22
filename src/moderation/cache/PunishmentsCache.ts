import { IMCache } from '../../framework/cache/Cache';
import { Service } from '../../framework/decorators/Service';
import { PunishmentConfig } from '../models/PunishmentConfig';
import { PunishmentService } from '../services/PunishmentService';

export class PunishmentCache extends IMCache<PunishmentConfig[]> {
	@Service() private punishments: PunishmentService;

	public async init() {
		// NO-OP
	}

	protected async _get(guildId: string): Promise<PunishmentConfig[]> {
		return this.punishments.getPunishmentConfigsForGuild(guildId);
	}
}
