import { Message } from 'eris';

import { IMClient } from '../../client';
import { generateLeaderboard } from '../../functions/Leaderboard';
import { EnumResolver } from '../../resolvers';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

enum ExportType {
	leaderboard = 'leaderboard'
}

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.export,
			aliases: [],
			args: [
				{
					name: 'type',
					resolver: new EnumResolver(client, Object.values(ExportType)),
					required: true
				}
			],
			group: CommandGroup.Premium,
			guildOnly: true,
			strict: true,
			premiumOnly: true
		});
	}

	public async action(
		message: Message,
		[type]: [ExportType],
		{ guild, t, isPremium }: Context
	): Promise<any> {
		const embed = this.client.createEmbed({
			title: t('cmd.export.title')
		});

		embed.description = t('cmd.export.preparing');

		switch (type) {
			case ExportType.leaderboard:
				this.client.sendReply(message, embed).then(async (msg: Message) => {
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
				break;

			default:
				return;
		}
	}
}
