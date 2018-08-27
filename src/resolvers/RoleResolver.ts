import { Role } from 'eris';

import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

const idRegex = /^(?:<@&)?(\d+)>?$/;

export class RoleResolver extends Resolver {
	public async resolve(value: string, { guild }: Context): Promise<Role> {
		if (!guild || !value) {
			return;
		}

		let role: Role;
		if (idRegex.test(value)) {
			const id = value.match(idRegex)[1];
			role = guild.roles.get(id);
		} else {
			const name = value.toLowerCase();
			const roles = guild.roles.filter(r => {
				const rName = r.name.toLowerCase();
				return rName.includes(name) || name.includes(rName);
			});
			if (roles.length === 1) {
				role = roles[0];
			} else {
				// TODO: Show error for multiple role matches
			}
		}

		return role;
	}
}
