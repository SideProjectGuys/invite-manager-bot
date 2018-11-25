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

	protected async getAll(guildIds: string[]): Promise<void> {
		// Load valid premium subs
		const subs = await premiumSubscriptionGuilds.findAll({
			where: {
				guildId: guildIds
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
			],
			raw: true
		});

		subs.forEach(sub => {
			this.cache.set(sub.guildId, true);
		});
	}

	protected async getOne(guildId: string): Promise<boolean> {
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
