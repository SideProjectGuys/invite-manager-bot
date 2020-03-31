import { Message } from 'eris';

import { IMClient } from '../../../client';
import { BotCommand, CommandGroup } from '../../../types';
import { EnumResolver } from '../../resolvers';
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
			defaultAdminOnly: true,
			premiumOnly: true,
			extraExamples: ['!export leaderboard']
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
				const msg = await this.sendReply(message, embed);
				if (!msg) {
					return;
				}

				if (type === 'leaderboard') {
					let csv = 'Id,Name,Total Invites,Regular,Custom,Fake,Leaves\n';

					const invs = await this.client.invs.generateLeaderboard(guild.id);
					invs.forEach((inv) => {
						csv +=
							`${inv.id},` +
							`"${inv.name.replace(/"/g, '\\"')}",` +
							`${inv.total},` +
							`${inv.regular},` +
							`${inv.custom},` +
							`${inv.fakes},` +
							`${inv.leaves},` +
							`\n`;
					});

					return message.channel
						.createMessage('', {
							file: Buffer.from(csv),
							name: 'InviteManagerExport.csv'
						})
						.then(() => msg.delete().catch(() => undefined))
						.catch(() => undefined);
				}
				break;

			default:
				return;
		}
	}
}
