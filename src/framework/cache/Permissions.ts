import { IMCache } from './Cache';

type PermissionsObject = { [cmd: string]: string[] };

export class PermissionsCache extends IMCache<PermissionsObject> {
	public async init() {
		// NO-OP
	}

	protected async _get(guildId: string): Promise<PermissionsObject> {
		const perms = await this.db.getRolePermissionsForGuild(guildId);

		const obj: PermissionsObject = {};

		perms.forEach((p) => {
			const cmd = p.command;
			if (!obj[cmd]) {
				obj[cmd] = [];
			}
			obj[cmd].push(p.roleId);
		});

		return obj;
	}
}
