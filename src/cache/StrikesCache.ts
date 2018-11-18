import { getRepository, In, Repository } from 'typeorm';

import { IMClient } from '../client';
import { StrikeConfig } from '../models/StrikeConfig';

import { GuildCache } from './GuildCache';

export class StrikesCache extends GuildCache<StrikeConfig[]> {
	private strikeConfigRepo: Repository<StrikeConfig>;

	public constructor(client: IMClient) {
		super(client);

		this.strikeConfigRepo = getRepository(StrikeConfig);
	}

	protected initOne(guildId: string): StrikeConfig[] {
		return [];
	}

	protected async getAll(guildIds: string[]): Promise<void> {
		const cfgs = await this.strikeConfigRepo.find({
			where: { guildId: In(guildIds) }
		});

		cfgs.forEach(cfg => {
			this.cache.get(cfg.guildId).push(cfg);
		});
	}

	protected async getOne(guildId: string): Promise<StrikeConfig[]> {
		return await this.strikeConfigRepo.find({
			where: { guildId }
		});
	}
}
