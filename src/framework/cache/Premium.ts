import { BotType } from '../../types';

import { IMCache } from './Cache';

export class PremiumCache extends IMCache<boolean> {
	public async init() {
		// NO-OP
	}

	// This is public on purpose, so we can use it in the IMClient class
	public async _get(guildId: string): Promise<boolean> {
		// Custom bots always have premium
		if (this.client.type === BotType.custom) {
			return true;
		}

		const sub = await this.db.getPremiumSubscriptionGuildForGuild(guildId);
		return !!sub;
	}
}
