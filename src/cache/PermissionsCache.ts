import { rolePermissions, roles } from '../sequelize';
import { BotCommand, ModerationCommand } from '../types';

import { GuildCache } from './GuildCache';

type AnyCommand = BotCommand | ModerationCommand;

type PermissionsObject = { [key in AnyCommand]?: string[] };

export class PermissionsCache extends GuildCache<PermissionsObject> {
	protected initOne() {
		return {};
	}

	protected async _get(guildId: string): Promise<PermissionsObject> {
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
