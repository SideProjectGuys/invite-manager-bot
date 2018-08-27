import { Message } from 'eris';

import { IMClient } from '../../client';
import { generateLeaderboard } from '../../functions/Leaderboard';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { EnumResolver } from '../../resolvers';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.export,
			aliases: [],
			desc: 'Export data of invite manager to a csv sheet',
			args: [
				{
					name: 'type',
					resolver: new EnumResolver(client, ['leaderboard']),
					description:
						'The type of export you want. One of:\n' + '- leaderboard'
				}
			],
			group: CommandGroup.Premium,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[type]: [string],
		{ guild, t }: Context
	): Promise<any> {
		const embed = createEmbed(this.client, {
			title: t('cmd.export.title')
		});

		const isPremium = await this.client.cache.isPremium(guild.id);
		if (!isPremium) {
			embed.description = t('cmd.export.premiumOnly');
			return sendReply(this.client, message, embed);
		}

		embed.description = t('cmd.export.preparing');

		if (type !== 'leaderboard') {
			return sendReply(this.client, message, t('cmd.export.invalidType'));
		}

		sendReply(this.client, message, embed).then(async (msg: Message) => {
			if (type === 'leaderboard') {
				let csv = 'Name,Total Invites,Regular,Custom,Fake,Leaves\n';

				const { keys, invs } = await generateLeaderboard(guild);
				keys.forEach(id => {
					const i = invs[id];
					csv +=
						`"${i.name.replace(/"/g, '\\"')}",` +
						`${i.total},` +
						`${i.regular},` +
						`${i.custom},` +
						`${i.fake},` +
						`${i.leaves},` +
						`\n`;
				});

				return message.channel
					.createMessage('', {
						file: Buffer.from(csv),
						name: 'InviteManagerExport.csv'
					})
					.then(() => msg.delete());
			}
		});
	}
}
