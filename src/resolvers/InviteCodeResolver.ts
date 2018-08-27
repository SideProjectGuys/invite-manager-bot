import { Invite } from 'eris';

import { Resolver } from './Resolver';

const codeRegex = /^(?:(?:https?:\/\/)?discord.gg\/)?(.*)$/;

export class InviteCodeResolver extends Resolver {
	public async resolve(value: string): Promise<Invite> {
		if (!value) {
			return;
		}

		let inv: Invite;
		if (codeRegex.test(value)) {
			const id = value.match(codeRegex)[1];
			inv = await this.client.getInvite(id);
		}

		return inv;
	}
}
