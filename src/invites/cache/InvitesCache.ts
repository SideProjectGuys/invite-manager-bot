import moment from 'moment';

import { IMCache } from '../../framework/cache/Cache';
import { Service } from '../../framework/decorators/Service';
import { InviteCounts, InvitesService } from '../services/Invites';

export class InvitesCache extends IMCache<Map<string, InviteCounts>> {
	@Service() protected invs: InvitesService;

	public async init() {
		this.maxCacheDuration = moment.duration(100, 'years');
	}

	protected async _get(guildId: string): Promise<Map<string, InviteCounts>> {
		const map = new Map();
		return map;
	}

	public async getOne(guildId: string, memberId: string) {
		const guildInvites = await this.get(guildId);
		let invites = guildInvites.get(memberId);
		if (!invites) {
			invites = await this.invs.getInviteCounts(guildId, memberId);
			guildInvites.set(memberId, invites);
		}
		return invites;
	}

	public hasOne(guildId: string, memberId: string) {
		const map = this.cache.get(guildId);
		return map && map.has(memberId);
	}

	public flushOne(guildId: string, memberId: string) {
		const map = this.cache.get(guildId);
		if (map) {
			map.delete(memberId);
		}
	}
}
