import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { BotCommand, CommandGroup } from '../../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.support,
			aliases: [],
			group: CommandGroup.Info,
			defaultAdminOnly: false,
			guildOnly: false
		});
	}

	public async action(message: Message, args: any[], flags: {}, { t }: Context): Promise<any> {
		const embed = this.createEmbed();

		embed.fields.push({
			name: t('cmd.support.server'),
			value: `https://discord.gg/Am6p2Hs`
		});

		return this.sendReply(message, embed);
	}
}
