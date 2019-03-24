import { Message } from 'eris';

import { IMClient } from '../../client';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.stop,
			aliases: [],
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
		// TODO
	}
}
