import { Message } from 'eris';

import { IMClient } from '../../client';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.ping,
			aliases: [],
			group: CommandGroup.Info,
			guildOnly: false
		});
	}

	public async action(
		message: Message,
		args: any[],
		context: Context
	): Promise<any> {
		let msg = await message.channel.createMessage('Pong!');
		msg.edit(`Pong! (${(msg.createdAt - message.createdAt).toFixed(0)}ms)`);
	}
}
