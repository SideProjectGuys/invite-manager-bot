import { BotCommand, InvitesCommand, ManagementCommand, ModerationCommand, MusicCommand } from '../../types';

import { Cache } from './Cache';

type AnyCommand = BotCommand | InvitesCommand | ModerationCommand | MusicCommand | ManagementCommand;

type PermissionsObject = { [key in AnyCommand]?: string[] };

export class PermissionsCache extends Cache<PermissionsObject> {
	public async init() {
		// NO-OP
	}

	protected async _get(guildId: string): Promise<PermissionsObject> {
		const perms = await this.client.db.getRolePermissionsForGuild(guildId);

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
