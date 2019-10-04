import { rolePermissions, roles } from '../../sequelize';
import { BotCommand, InvitesCommand, ModerationCommand, MusicCommand } from '../../types';

import { Cache } from './Cache';

type AnyCommand = BotCommand | InvitesCommand | ModerationCommand | MusicCommand;

type PermissionsObject = { [key in AnyCommand]?: string[] };

export class PermissionsCache extends Cache<PermissionsObject> {
	public async init() {
		// TODO
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
