import { Message } from 'eris';

import { IMClient } from '../../client';
import { OwnerCommand } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: OwnerCommand.help,
			aliases: ['owner-help', 'oh'],
			strict: true,
			hidden: true,
			guildOnly: false
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ guild, settings }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const prefix = settings ? settings.prefix : '!';

		const commands = this.client.cmds.commands
			.filter(c => c.hidden)
			.map(c => c.usage.replace('{prefix}', prefix));

		const embed = this.client.createEmbed({
			description: commands.join('\n')
		});

		this.client.sendReply(message, embed);
	}
}
