import { Role } from 'eris';

import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

const idRegex = /^(?:<@&)?(\d+)>?$/;

export class RoleResolver extends Resolver {
	public async resolve(value: string, { guild, t }: Context): Promise<Role> {
		if (!guild || !value) {
			return;
		}

		let role: Role;
		if (idRegex.test(value)) {
			const id = value.match(idRegex)[1];
			role = guild.roles.get(id);
			if (!role) {
				throw Error(t('arguments.role.notFound'));
			}
		} else {
			const name = value.toLowerCase();

			// Trying to find exact match
			let roles = guild.roles.filter(r => {
				const rName = r.name.toLowerCase();
				return rName === name;
			});

			// If no roles found, allow for partial match
			if (roles.length === 0) {
				roles = guild.roles.filter(r => {
					const rName = r.name.toLowerCase();
					return rName.includes(name) || name.includes(rName);
				});
			}

			if (roles.length === 1) {
				role = roles[0];
			} else {
				if (roles.length === 0) {
					throw Error(t('arguments.role.notFound'));
				} else {
					throw Error(
						t('arguments.role.multiple', {
							roles: roles
								.slice(0, 10)
								.map(r => `\`${r.name}\``)
								.join(', ')
						})
					);
				}
			}
		}

		return role;
	}

	public getType() {
		return 'Role';
	}

	public getExamples(rest: boolean) {
		return [`@Role`, `Role`, rest ? 'Role with space' : '"Role with space"'];
	}
}
