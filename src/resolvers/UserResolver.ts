import { User } from 'eris';

import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

const idRegex = /^(?:<@!?)?(\d+)>?$/;

export class UserResolver extends Resolver {
	public async resolve(value: string, { t }: Context): Promise<User> {
		if (!value) {
			return;
		}

		let user: User;
		if (idRegex.test(value)) {
			const id = value.match(idRegex)[1];
			user = this.client.users.get(id);
			if (!user) {
				user = await this.client.getRESTUser(id);
			}
			if (!user) {
				throw Error(t('arguments.user.notFound'));
			}
		} else {
			const name = value.toLowerCase();
			const users = this.client.users.filter(u => {
				const uName = u.username.toLowerCase() + '#' + u.discriminator;
				return uName.includes(name) || name.includes(uName);
			});
			if (users.length === 1) {
				user = users[0];
			} else {
				if (users.length === 0) {
					throw Error(t('arguments.user.notFound'));
				} else {
					throw Error(
						t('arguments.user.multiple', {
							users: users
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
