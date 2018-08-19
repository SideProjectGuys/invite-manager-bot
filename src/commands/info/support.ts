import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message
} from '@yamdbf/core';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { checkProBot } from '../../middleware';
import { CommandGroup } from '../../types';

const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'support',
			aliases: [],
			desc: 'Get an invite link to our support server',
			usage: '<prefix>support',
			group: CommandGroup.Info,
			guildOnly: false
		});
	}

	@using(checkProBot)
	public async action(message: Message, args: string[]): Promise<any> {
		this._logger.log(
			`${message.guild ? message.guild.name : 'DM'} (${
				message.author.username
			}): ${message.content}`
		);

		const embed = createEmbed(this.client);

		embed.addField('Support server', `https://discord.gg/Am6p2Hs`);

		return sendReply(message, embed);
	}
}
