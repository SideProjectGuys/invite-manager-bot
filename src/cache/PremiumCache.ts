import {
	premiumSubscriptionGuilds,
	premiumSubscriptions,
	sequelize
} from '../sequelize';

import { GuildCache } from './GuildCache';

export class PremiumCache extends GuildCache<boolean> {
	protected initOne(guildId: string): boolean {
		return false;
	}

	// This is public on purpose, so we can use it in the IMClient class
	public async _get(guildId: string): Promise<boolean> {
		const sub = await premiumSubscriptionGuilds.findOne({
			where: {
				guildId
			},
			include: [
				{
					attributes: [],
					model: premiumSubscriptions,
					where: {
						validUntil: {
							[sequelize.Op.gte]: new Date()
						}
					},
					required: true
				}
			]
		});

		return !!sub;
	}
}
