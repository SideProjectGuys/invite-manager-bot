import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { ReactionRoleCache } from './cache/ReactionRoleCache';
import { ManagementService } from './services/ManagementService';

export class ManagementModule extends IMModule {
	public constructor(client: IMClient) {
		super(client);

		this.registerService(ManagementService);

		this.registerCache(ReactionRoleCache);
	}
}
