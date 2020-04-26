import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { ReactionRoleCache } from './cache/ReactionRoleCache';
import placeholder from './commands/messages/placeholder';
import makeMentionable from './commands/roles/makeMentionable';
import mentionRole from './commands/roles/mentionRole';
import reactionRoles from './commands/roles/reactionRoles';
import { ManagementService } from './services/ManagementService';

export class ManagementModule extends IMModule {
	public name: string = 'Management';

	public constructor(client: IMClient) {
		super(client);

		// Services
		this.registerService(ManagementService);

		// Caches
		this.registerCache(ReactionRoleCache);

		// Commands
		this.registerCommand(placeholder);

		this.registerCommand(makeMentionable);
		this.registerCommand(mentionRole);
		this.registerCommand(reactionRoles);
	}
}
