import moment from 'moment';

import { Cache } from '../../../framework/cache/Cache';
import { LeaderboardEntry } from '../services/Invites';

export class LeaderboardCache extends Cache<LeaderboardEntry[]> {
	public async init() {
		this.maxCacheDuration = moment.duration(10, 'minute');
	}

	protected async _get(guildId: string): Promise<LeaderboardEntry[]> {
		return await this.client.invs.generateLeaderboard(guildId);
	}
}
