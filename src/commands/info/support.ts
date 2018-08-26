import { Message } from 'eris';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { BotCommand, CommandGroup } from '../../types';
import { Command } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.support,
			aliases: [],
			desc: 'Get an invite link to our support server',
			group: CommandGroup.Info,
			guildOnly: false
		});
	}

	public async action(message: Message, args: any[]): Promise<any> {
		const embed = createEmbed(this.client);

		embed.fields.push({
			name: 'Support server',
			value: `https://discord.gg/Am6p2Hs`
		});

		return sendReply(this.client, message, embed);
	}
}
