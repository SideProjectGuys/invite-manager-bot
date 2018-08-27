import { Command, Context } from '../commands/Command';

import { Resolver } from './Resolver';

export class CommandResolver extends Resolver {
	public async resolve(value: string, { guild }: Context): Promise<Command> {
		if (!guild || !value) {
			return;
		}

		const name = value.toLowerCase();
		return this.client.cmds.commands.find(
			c => c.name.toLowerCase().includes(name) || c.aliases.indexOf(name) >= 0
		);
	}
}
