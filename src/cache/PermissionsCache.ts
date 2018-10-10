import { BotCommand, ModerationCommand, OwnerCommand } from '../types';
import { Cache } from './Cache';
import { rolePermissions, roles } from '../sequelize';

const config = require('../../config.json');

type PermissionsObject = {
	[key in BotCommand | OwnerCommand | ModerationCommand]: string[]
};

export class PermissionsCache extends Cache<PermissionsObject> {
	protected initOne(guildId: string) {
		// Create permissions map
		const obj: PermissionsObject = {} as any;
		Object.values(BotCommand).forEach((k: BotCommand) => (obj[k] = []));
		Object.values(ModerationCommand).forEach(
			(k: ModerationCommand) => (obj[k] = [])
		);
		if (config.ownerGuildIds.indexOf(guildId) !== -1) {
			Object.values(OwnerCommand).forEach((k: OwnerCommand) => (obj[k] = []));
		}
		return obj;
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
			const cmd = p.command as BotCommand | OwnerCommand;
			this.cache.get(p['role.guildId'])[cmd].push(p.roleId);
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

		const obj: PermissionsObject = {} as any;
		Object.values(BotCommand).forEach((k: BotCommand) => (obj[k] = []));
		Object.values(ModerationCommand).forEach(
			(k: ModerationCommand) => (obj[k] = [])
		);
		if (config.ownerGuildIds.indexOf(guildId) !== -1) {
			Object.values(OwnerCommand).forEach((k: OwnerCommand) => (obj[k] = []));
		}

		perms.forEach((p: any) => {
			const cmd = p.command as BotCommand | OwnerCommand;
			obj[cmd].push(p.roleId);
		});

		return obj;
	}
}
