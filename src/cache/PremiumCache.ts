import { premiumSubscriptions, sequelize } from '../sequelize';

import { Cache } from './Cache';

export class PremiumCache extends Cache<boolean> {
	protected initOne(guildId: string): boolean {
		return false;
	}

	protected async getAll(guildIds: string[]): Promise<void> {
		// Load valid premium subs
		const subs = await premiumSubscriptions.findAll({
			where: {
				guildId: guildIds,
				validUntil: {
					[sequelize.Op.gte]: new Date()
				}
			},
			raw: true
		});

		subs.forEach(sub => {
			this.cache.set(sub.guildId, true);
		});
	}

	protected async getOne(guildId: string): Promise<boolean> {
		const sub = await premiumSubscriptions.count({
			where: {
				guildId,
				validUntil: {
					[sequelize.Op.gte]: new Date()
				}
			}
		});

		return sub > 0;
	}
}
