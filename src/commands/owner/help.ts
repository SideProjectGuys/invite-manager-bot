import { Message } from 'eris';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { OwnerCommand } from '../../types';
import { Command, Context } from '../Command';

const config = require('../../../config.json');

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: OwnerCommand.help,
			aliases: ['owner-help', 'oh'],
			desc: 'Admin help',
			hidden: true,
			guildOnly: false
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ guild, settings }: Context
	): Promise<any> {
		if (config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const prefix = settings ? settings.prefix : '!';

		const commands = this.client.commands
			.filter(c => c.ownerOnly || c.hidden)
			.map(c => c.usage.replace('<prefix>', prefix));

		const embed = createEmbed(this.client, {
			description: commands.join('\n')
		});

		sendReply(this.client, message, embed);
	}
}
