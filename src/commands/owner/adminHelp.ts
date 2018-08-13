import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';

import { IMClient } from '../../client';
import { createEmbed } from '../../functions/Messaging';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'adminHelp',
			aliases: ['admin-help', 'oh'],
			desc: 'Admin help',
			usage: '<prefix>adminHelp',
			ownerOnly: true,
			hidden: true
		});
	}

	public async action(message: Message, [args]: [string]): Promise<any> {
		this._logger.log(`(${message.author.username}): ${message.content}`);

		const prefix = message.guild
			? await this.client.getPrefix(message.guild)
			: '!';

		const commands = this.client.commands
			.filter(c => c.ownerOnly || c.hidden)
			.map(c => c.usage.replace('<prefix>', prefix));

		const embed = createEmbed(this.client);

		embed.setDescription(commands.join('\n'));
	}
}
