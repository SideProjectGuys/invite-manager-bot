import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../Command';

export default class extends IMCommand {
	public constructor(client: IMClient) {
		super(client, {
			name: 'support',
			aliases: [],
			group: 'Info',
			defaultAdminOnly: false,
			guildOnly: false
		});
	}

	public async action(message: Message, args: any[], flags: {}, { t }: CommandContext): Promise<any> {
		const embed = this.createEmbed();

		embed.fields.push({
			name: t('cmd.support.server'),
			value: `https://discord.gg/Am6p2Hs`
		});

		return this.sendReply(message, embed);
	}
}
