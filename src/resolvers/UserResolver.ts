import { Context } from '../commands/Command';
import { members } from '../sequelize';

import { Resolver } from './Resolver';

const idRegex = /^(?:<@!?)?(\d+)>?$/;

export interface BasicUser {
	id: string;
	createdAt: number;
	username: string;
	discriminator: string;
}

export class UserResolver extends Resolver {
	public async resolve(
		value: string,
		{ guild, t }: Context
	): Promise<BasicUser> {
		if (!value) {
			return;
		}

		let user: BasicUser;
		if (idRegex.test(value)) {
			const id = value.match(idRegex)[1];
			user = this.client.users.get(id);
			if (!user) {
				user = await this.client.getRESTUser(id).then(() => undefined);
			}
			if (!user) {
				user = await members.findOne({ where: { id }, raw: true }).then(u => ({
					...u,
					username: u.name,
					createdAt: (u.createdAt as Date).getTime()
				}));
			}
			if (!user) {
				throw Error(t('arguments.user.notFound'));
			}
		} else {
			const fullName = value.toLowerCase();
			const [username, discriminator] = fullName.split('#');

			// Trying to find exact match
			let users: BasicUser[] = this.client.users.filter(
				u =>
					u.username.toLowerCase() === username &&
					u.discriminator === discriminator
			);

			// Trying to find approximate match in guild
			if (guild && users.length === 0) {
				users = guild.members
					.filter(m => {
						const mName = m.username.toLowerCase() + '#' + m.discriminator;
						return mName.includes(fullName) || fullName.includes(mName);
					})
					.map(m => m.user);
			}

			// If no user found, allow for partial match
			if (users.length === 0) {
				// Search in all users of this shard
				users = this.client.users.filter(u => {
					const uName = u.username.toLowerCase() + '#' + u.discriminator;
					return uName.includes(fullName) || fullName.includes(uName);
				});
			}

			// If still nothing found try using DB
			if (users.length === 0) {
				// Trying to find exact match
				users = await members
					.findAll({
						where: { name: username, ...(discriminator && { discriminator }) },
						raw: true
					})
					.then(us =>
						us.map(u => ({
							...u,
							username: u.name,
							createdAt: (u.createdAt as Date).getTime()
						}))
					);
			}

			if (users.length === 0) {
				// Trying to find partial match in DB
				users = await members
					.findAll({
						where: {
							name: `%${username}%`,
							...(discriminator && { discriminator: `%${discriminator}%` })
						},
						raw: true
					})
					.then(us =>
						us.map(u => ({
							...u,
							username: u.name,
							createdAt: (u.createdAt as Date).getTime()
						}))
					);
			}

			if (users.length === 1) {
				user = users[0];
			} else if (users.length === 0) {
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

		return user;
	}
}
