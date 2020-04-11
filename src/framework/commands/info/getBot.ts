import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../Command';

export default class extends IMCommand {
	public constructor(client: IMClient) {
		super(client, {
			name: 'getBot',
			aliases: ['get-bot', 'invite-bot', 'inviteBot'],
			group: 'Info',
			defaultAdminOnly: false,
			guildOnly: false
		});
	}

	public async action(message: Message, args: any[], flags: {}, { guild, t }: CommandContext): Promise<any> {
		const embed = this.createEmbed();

		const params = [];
		params.push(`origin=getbot`);
		params.push(`user=${message.author.id}`);
		if (guild) {
			params.push(`guild=${guild.id}`);
		}

		embed.description = `[${t('cmd.getBot.title')}]` + `(https://invitemanager.co/add-bot?${params.join('&')})`;

		return this.sendReply(message, embed);
	}
}
