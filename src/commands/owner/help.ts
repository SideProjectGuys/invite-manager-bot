import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message
} from '@yamdbf/core';

import { IMClient } from '../../client';
import { createEmbed } from '../../functions/Messaging';
import { checkRoles } from '../../middleware/CheckRoles';
import { OwnerCommand } from '../../types';

const config = require('../../../config.json');

const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'owner-help',
			aliases: ['owner-help', 'oh'],
			desc: 'Admin help',
			usage: '<prefix>owner-help',
			hidden: true
		});
	}

	@using(checkRoles(OwnerCommand.help))
	public async action(message: Message, [args]: [string]): Promise<any> {
		this._logger.log(`(${message.author.username}): ${message.content}`);

		if (config.ownerGuildIds.indexOf(message.guild.id) === -1) {
			return;
		}

		const prefix = message.guild
			? await this.client.getPrefix(message.guild)
			: '!';

		const commands = this.client.commands
			.filter(c => c.ownerOnly || c.hidden)
			.map(c => c.usage.replace('<prefix>', prefix));

		const embed = createEmbed(this.client);

		embed.setDescription(commands.join('\n'));

		message.channel.send(embed);
	}
}
