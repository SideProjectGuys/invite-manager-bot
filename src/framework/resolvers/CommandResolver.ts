import { IMClient } from '../../client';
import { CommandContext, IMCommand } from '../commands/Command';

import { Resolver } from './Resolver';

export class CommandResolver extends Resolver {
	private cmds: IMCommand[] = [];

	public constructor(client: IMClient) {
		super(client);

		this.cmds = [...this.client.commands.values()];
	}

	public async resolve(value: string, { guild, t }: CommandContext): Promise<IMCommand> {
		if (!guild || !value) {
			return;
		}

		const name = value.toLowerCase();
		const cmds = this.cmds.filter((c) => c.name.toLowerCase().includes(name) || c.aliases.indexOf(name) >= 0);

		if (cmds.length === 0) {
			throw Error(t(`resolvers.${this.getType()}.notFound`));
		} else if (cmds.length === 1) {
			return cmds[0];
		} else {
			const cmd = cmds.find((c) => c.name.length - name.length === 0);
			if (!cmd) {
				throw Error(
					t(`resolvers.${this.getType()}.multiple`, {
						commands: cmds
							.slice(0, 10)
							.map((c) => `\`${c.name}\``)
							.join(', ')
					})
				);
			}
			return cmd;
		}
	}

	public getHelp({ t }: CommandContext) {
		return t(`resolvers.${this.getType()}.validValues`, {
			values: this.cmds.map((c) => '`' + c.name + '`').join(', ')
		});
	}
}
