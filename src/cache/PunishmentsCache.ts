import { getRepository, In, Repository } from 'typeorm';

import { IMClient } from '../client';
import { PunishmentConfig } from '../models/PunishmentConfig';

import { GuildCache } from './GuildCache';

export class PunishmentCache extends GuildCache<PunishmentConfig[]> {
	private punishConfigRepo: Repository<PunishmentConfig>;

	public constructor(client: IMClient) {
		super(client);

		this.punishConfigRepo = getRepository(PunishmentConfig);
	}

	protected initOne(guildId: string): PunishmentConfig[] {
		return [];
	}

	protected async getAll(guildIds: string[]): Promise<void> {
		const cfgs = await this.punishConfigRepo.find({
			where: { guildId: In(guildIds) }
		});

		cfgs.forEach(cfg => {
			this.cache.get(cfg.guildId).push(cfg);
		});
	}

	protected async getOne(guildId: string): Promise<PunishmentConfig[]> {
		return await this.punishConfigRepo.find({
			where: {
				guildId
			}
		});
	}
}
