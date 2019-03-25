import { Message } from 'eris';

import { IMClient } from '../../client';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.resume,
			aliases: ['start'],
			group: CommandGroup.Music,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		flags: {},
		{ t, guild }: Context
	): Promise<any> {
		const conn = await this.client.music.getMusicConnection(guild);
		if (!conn.isConnected()) {
			this.sendReply(message, 'I am currently not playing any music');
			return;
		}

		if (conn.isPaused()) {
			conn.resume();
		}
	}
}
