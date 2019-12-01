import { Cache } from '../../framework/cache/Cache';
import { ReactionRole } from '../models/ReactionRole';

export class ReactionRoleCache extends Cache<ReactionRole[]> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<ReactionRole[]> {
		return this.client.db.getReactionRolesForGuild(guildId);
	}
}
