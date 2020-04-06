import moment from 'moment';

import { IMCache } from '../../framework/cache/Cache';
import { Service } from '../../framework/decorators/Service';
import { BotType } from '../../types';
import { InvitesService, LeaderboardEntry } from '../services/Invites';

export class LeaderboardCache extends IMCache<LeaderboardEntry[]> {
	@Service() protected invs: InvitesService;

	public async init() {
		this.maxCacheDuration =
			this.client.type === BotType.custom
				? moment.duration(5, 'minute')
				: this.client.type === BotType.pro
				? moment.duration(1, 'hour')
				: moment.duration(24, 'hour');
	}

	protected async _get(guildId: string): Promise<LeaderboardEntry[]> {
		return await this.invs.generateLeaderboard(guildId);
	}
}
