import { IMCache } from '../../framework/cache/Cache';
import { Service } from '../../framework/decorators/Service';
import { ReactionRole } from '../models/ReactionRole';
import { ManagementService } from '../services/ManagementService';

export class ReactionRoleCache extends IMCache<ReactionRole[]> {
	@Service() private mgmt: ManagementService;

	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<ReactionRole[]> {
		return this.mgmt.getReactionRolesForGuild(guildId);
	}
}
