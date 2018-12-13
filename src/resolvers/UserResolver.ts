import { User } from 'eris';

import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

const idRegex = /^(?:<@!?)?(\d+)>?$/;

export class UserResolver extends Resolver {
	public async resolve(value: string, { guild, t }: Context): Promise<User> {
		if (!value) {
			return;
		}

		let user: User;
		if (idRegex.test(value)) {
			const id = value.match(idRegex)[1];
			user = this.client.users.get(id);
			if (!user) {
				user = await this.client.getRESTUser(id).then(() => undefined);
			}
			if (!user) {
				throw Error(t('arguments.user.notFound'));
			}
		} else {
			const name = value.toLowerCase();

			// Trying to find exact match
			let users = this.client.users.filter(u => {
				const uName = u.username.toLowerCase() + '#' + u.discriminator;
				return uName === name;
			});

			// Trying to find exact match in guild
			if (guild && users.length === 0) {
				users = guild.members
					.filter(m => {
						const mName = m.username.toLowerCase() + '#' + m.discriminator;
						return mName.includes(name) || name.includes(mName);
					})
					.map(m => m.user);
			}

			// If no user found, allow for partial match
			if (users.length === 0) {
				users = this.client.users.filter(u => {
					const uName = u.username.toLowerCase() + '#' + u.discriminator;
					return uName.includes(name) || name.includes(uName);
				});
			}

			if (users.length === 1) {
				user = users[0];
			} else {
				if (users.length === 0) {
					throw Error(t('arguments.user.notFound'));
				} else {
					throw Error(
						t('arguments.user.multiple', {
							users: users
								.slice(0, 10)
								.map(u => `\`${u.username}#${u.discriminator}\``)
								.join(', ')
						})
					);
				}
			}
		}

		return user;
	}
}
