import { getRepository, In, Repository } from 'typeorm';

import { IMClient } from '../client';
import { RolePermission } from '../models/RolePermission';
import { BotCommand, ModerationCommand, OwnerCommand } from '../types';

import { GuildCache } from './GuildCache';

type AnyCommand = BotCommand | ModerationCommand | OwnerCommand;

type PermissionsObject = { [key in AnyCommand]?: string[] };

export class PermissionsCache extends GuildCache<PermissionsObject> {
	private rolePermsRepo: Repository<RolePermission>;

	public constructor(client: IMClient) {
		super(client);

		this.rolePermsRepo = getRepository(RolePermission);
	}

	protected initOne() {
		return {};
	}

	protected async getAll(guildIds: string[]): Promise<void> {
		// Load all role permissions
		const perms = await this.rolePermsRepo.find({
			relations: ['role'],
			where: { guildId: In(guildIds) }
		});

		// Then insert the role permissions we got from the db
		perms.forEach(p => {
			const cmd = p.command as AnyCommand;
			const obj = this.cache.get(p.role.guildId);
			if (!obj[cmd]) {
				obj[cmd] = [];
			}
			obj[cmd].push(p.role.id);
		});
	}

	protected async getOne(guildId: string): Promise<PermissionsObject> {
		const perms = await this.rolePermsRepo.find({
			relations: ['role'],
			where: { guildId }
		});

		const obj: PermissionsObject = {};

		perms.forEach(p => {
			const cmd = p.command as AnyCommand;
			if (!obj[cmd]) {
				obj[cmd] = [];
			}
			obj[cmd].push(p.role.id);
		});

		return obj;
	}
}
