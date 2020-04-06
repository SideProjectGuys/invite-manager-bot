import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { PunishmentCache } from './cache/PunishmentsCache';
import { StrikesCache } from './cache/StrikesCache';
import { ModerationService } from './services/Moderation';

export class ModerationModule extends IMModule {
	public constructor(client: IMClient) {
		super(client);

		this.registerService(ModerationService);

		this.registerCache(PunishmentCache);
		this.registerCache(StrikesCache);
	}
}
