import { Message } from 'eris';

import { IMClient } from '../../client';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.support,
			aliases: [],
			group: CommandGroup.Info,
			guildOnly: false
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ t }: Context
	): Promise<any> {
		const embed = this.client.createEmbed();

		embed.fields.push({
			name: t('cmd.support.server'),
			value: `https://discord.gg/Am6p2Hs`
		});

		return this.client.sendReply(message, embed);
	}
}
