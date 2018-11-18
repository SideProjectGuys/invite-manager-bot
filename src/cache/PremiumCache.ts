import { getRepository, In, MoreThan, Repository } from 'typeorm';

import { IMClient } from '../client';
import { PremiumSubscription } from '../models/PremiumSubscription';

import { GuildCache } from './GuildCache';

export class PremiumCache extends GuildCache<boolean> {
	private premiumSubsRepo: Repository<PremiumSubscription>;

	public constructor(client: IMClient) {
		super(client);

		this.premiumSubsRepo = getRepository(PremiumSubscription);
	}

	protected initOne(guildId: string): boolean {
		return false;
	}

	protected async getAll(guildIds: string[]): Promise<void> {
		// Load valid premium subs
		const subs = await this.premiumSubsRepo.find({
			where: {
				guildId: In(guildIds),
				validUntil: MoreThan(new Date())
			}
		});

		subs.forEach(sub => {
			this.cache.set(sub.guildId, true);
		});
	}

	protected async getOne(guildId: string): Promise<boolean> {
		const sub = await this.premiumSubsRepo.count({
			where: {
				guildId,
				validUntil: MoreThan(new Date())
			}
		});

		return sub > 0;
	}
}
