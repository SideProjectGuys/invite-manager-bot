import { IMCache } from '../../framework/cache/Cache';
import { ReactionRole } from '../models/ReactionRole';

export class ReactionRoleCache extends IMCache<ReactionRole[]> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<ReactionRole[]> {
		return this.db.getReactionRolesForGuild(guildId);
	}
}
