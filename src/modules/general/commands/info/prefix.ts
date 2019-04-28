import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { BotCommand, CommandGroup } from '../../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.prefix,
			aliases: [],
			group: CommandGroup.Info,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		flags: {},
		{ settings, t }: Context
	): Promise<any> {
		return this.sendReply(
			message,
			t('cmd.prefix.title', {
				prefix: settings.prefix
			})
		);
	}
}
