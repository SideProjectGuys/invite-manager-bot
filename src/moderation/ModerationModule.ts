import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { PunishmentCache } from './cache/PunishmentsCache';
import { StrikesCache } from './cache/StrikesCache';
import { AutoModerationService } from './services/AutoModeration';
import { ModerationService } from './services/Moderation';
import { PunishmentService } from './services/PunishmentService';
import { StrikeService } from './services/StrikeService';

export class ModerationModule extends IMModule {
	public constructor(client: IMClient) {
		super(client);

		this.registerService(ModerationService);
		this.registerService(StrikeService);
		this.registerService(PunishmentService);
		this.registerService(AutoModerationService);

		this.registerCache(PunishmentCache);
		this.registerCache(StrikesCache);
	}
}
