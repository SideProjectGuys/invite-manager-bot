import { Message } from 'eris';

import { IMClient } from '../../../client';
import { BotCommand, CommandGroup } from '../../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.ping,
			aliases: [],
			group: CommandGroup.Info,
			defaultAdminOnly: false,
			guildOnly: false
		});
	}

	public async action(message: Message, args: any[], flags: {}, context: Context): Promise<any> {
		const msg = await message.channel.createMessage('Pong!').catch(() => undefined);
		if (msg) {
			msg.edit(`Pong! (${(msg.createdAt - message.createdAt).toFixed(0)}ms)`);
		}
	}
}
