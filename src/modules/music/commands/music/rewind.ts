import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { BotCommand, CommandGroup } from '../../../../types';
import { Command, Context } from '../../../../framework/commands/Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.rewind,
			aliases: ['replay'],
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
		conn.rewind();
	}
}
