import { Message } from 'eris';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.prefix,
			aliases: [],
			desc: 'Shows the current prefix of the bot',
			group: CommandGroup.Info,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ settings, t }: Context
	): Promise<any> {
		sendReply(
			this.client,
			message,
			t('cmd.prefix.title', {
				prefix: settings.prefix
			})
		);
	}
}
