import { Role } from 'eris';

import { Context } from '../Command';
import { Resolver } from '../Resolver';

const idRegex: RegExp = /^(?:<@&)?(\d+)>?$/;

export class RoleResolver extends Resolver {
	public async resolve(value: string, { guild }: Context): Promise<Role> {
		if (!guild) {
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
				// TODO: Show error for multiple user matches
			}
		}

		return role;
	}
}
