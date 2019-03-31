import { Message } from 'eris';

import { IMClient } from '../../../../../client';
import { EnumResolver } from '../../../../../framework/resolvers';
import { BotCommand, CommandGroup } from '../../../../../types';
import { Command, Context } from '../../../../../framework/commands/Command';

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
		flags: {},
		{ guild, t, isPremium }: Context
	): Promise<any> {
		const embed = this.createEmbed({
			title: t('cmd.export.title')
		});

		embed.description = t('cmd.export.preparing');

		switch (type) {
			case ExportType.leaderboard:
				this.sendReply(message, embed).then(async (msg: Message) => {
					if (type === 'leaderboard') {
						let csv = 'Id,Name,Total Invites,Regular,Custom,Fake,Leaves\n';

						const { keys, invs } = await this.client.invs.generateLeaderboard(
							guild
						);
						keys.forEach(id => {
							const i = invs[id];
							csv +=
								`${i.id},` +
								`"${i.name.replace(/"/g, '\\"')}",` +
								`${i.total},` +
								`${i.regular},` +
								`${i.custom},` +
								`${i.fakes},` +
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
