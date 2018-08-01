import { Command, Logger, logger, Message } from '@yamdbf/core';

import { IMClient } from '../../client';
import { CommandGroup, createEmbed, sendEmbed } from '../../utils/util';

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'support',
			aliases: [],
			desc: 'Get an invite link to our support server',
			usage: '<prefix>support',
			group: CommandGroup.Other,
			guildOnly: false
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		this._logger.log(
			`${message.guild ? message.guild.name : 'DM'} (${message.author.username}): ${message.content}`
		);

		const embed = createEmbed(this.client);

		embed.addField('Support server', `https://discord.gg/Am6p2Hs`);

		sendEmbed(message.channel, embed, message.author);
	}
}
