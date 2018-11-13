import { rolePermissions, roles } from '../sequelize';
import { BotCommand, ModerationCommand, OwnerCommand } from '../types';

import { GuildCache } from './GuildCache';

type AnyCommand = BotCommand | ModerationCommand | OwnerCommand;

type PermissionsObject = { [key in AnyCommand]?: string[] };

export class PermissionsCache extends GuildCache<PermissionsObject> {
	protected initOne() {
		return {};
	}

	protected async getAll(guildIds: string[]): Promise<void> {
		// Load all role permissions
		const perms = await rolePermissions.findAll({
			include: [
				{
					model: roles,
					where: {
						guildId: guildIds
					}
				}
			],
			raw: true
		});

		// Then insert the role permissions we got from the db
		perms.forEach((p: any) => {
			const cmd = p.command as AnyCommand;
			const obj = this.cache.get(p['role.guildId']);
			if (!obj[cmd]) {
				obj[cmd] = [];
			}
			obj[cmd].push(p.roleId);
		});
	}

	protected async getOne(guildId: string): Promise<PermissionsObject> {
		const perms = await rolePermissions.findAll({
			include: [
				{
					model: roles,
					where: { guildId }
				}
			],
			raw: true
		});

		const obj: PermissionsObject = {};

		perms.forEach((p: any) => {
			const cmd = p.command as AnyCommand;
			if (!obj[cmd]) {
				obj[cmd] = [];
			}
			obj[cmd].push(p.roleId);
		});

		return obj;
	}
}
