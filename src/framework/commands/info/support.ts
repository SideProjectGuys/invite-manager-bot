import { Message } from 'eris';

import { IMModule } from '../../Module';
import { CommandContext, IMCommand } from '../Command';

export default class extends IMCommand {
	public constructor(module: IMModule) {
		super(module, {
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
