import { ChannelInvite, RESTInvite } from 'eris';

import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

const codeRegex = /^(?:(?:https?:\/\/)?discord.gg\/)?(.*)$/;

export class InviteCodeResolver extends Resolver {
	public async resolve(value: string, { t }: Context): Promise<RESTInvite> {
		if (!value) {
			return;
		}

		let inv: RESTInvite;
		if (codeRegex.test(value)) {
			const id = value.match(codeRegex)[1];
			inv = await this.client.getInvite(id);
		}
		if (!inv) {
			throw Error(t(`resolvers.invitecode.notFound`));
		}

		return inv;
	}
}
