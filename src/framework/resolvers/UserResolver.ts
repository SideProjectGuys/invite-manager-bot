import { BasicUser } from '../../types';
import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

const idRegex = /^(?:<@!?)?(\d+)>?$/;

export class UserResolver extends Resolver {
	public async resolve(value: string, { guild, t }: Context): Promise<BasicUser> {
		if (!value) {
			return;
		}

		let user: BasicUser;
		// Check if we're resolving by id or name & discriminator
		if (idRegex.test(value)) {
			const id = value.match(idRegex)[1];
			// First try our local cache
			user = this.client.users.get(id);
			// Then try the rest API
			if (!user) {
				user = await this.client.getRESTUser(id).then(() => undefined);
			}
			// Then try our database
			if (!user) {
				user = await this.client.db.getMember(guild.id, id).then((u) => ({
					...u,
					username: u.name,
					createdAt: u.createdAt.getTime(),
					avatarURL: undefined
				}));
			}
			if (!user) {
				throw Error(t(`resolvers.${this.getType()}.notFound`));
			}
		} else {
			const fullName = value.toLowerCase();
			const [username, discriminator] = fullName.split('#');

			// First try to find an exact match in our cache
			let users: BasicUser[] = this.client.users.filter(
				(u) => u.username.toLowerCase() === username && u.discriminator === discriminator
			);

			// Then try to find an approximate match in our guild
			if (guild && users.length === 0) {
				users = guild.members
					.filter((m) => {
						const mName = m.username.toLowerCase() + '#' + m.discriminator;
						return mName.includes(fullName) || fullName.includes(mName);
					})
					.map((m) => m.user);
			}

			// Next allow for partial match in our cache
			if (users.length === 0) {
				users = this.client.users.filter((u) => {
					const uName = u.username.toLowerCase() + '#' + u.discriminator;
					return uName.includes(fullName) || fullName.includes(uName);
				});
			}

			// Try to find exact match in DB
			if (users.length === 0) {
				users = await this.client.db.getMembersByName(guild.id, username, discriminator).then((us) =>
					us.map((u) => ({
						...u,
						username: u.name,
						createdAt: u.createdAt.getTime(),
						avatarURL: undefined
					}))
				);
			}

			// Try to find partial match in DB
			if (users.length === 0) {
				users = await this.client.db.getMembersByName(guild.id, username, discriminator).then((us) =>
					us.map((u) => ({
						...u,
						username: u.name,
						createdAt: u.createdAt.getTime(),
						avatarURL: undefined
					}))
				);
			}

			if (users.length === 1) {
				user = users[0];
			} else if (users.length === 0) {
				throw Error(t(`resolvers.${this.getType()}.notFound`));
			} else {
				throw Error(
					t(`resolvers.${this.getType()}.multiple`, {
						users: users
							.slice(0, 10)
							.map((u) => `\`${u.username}#${u.discriminator}\``)
							.join(', ')
					})
				);
			}
		}

		return user;
	}
}
