import { Message, Role } from 'eris';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import { LogAction, ranks } from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';
import { RoleResolver } from '../resolvers';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.removeRank,
			aliases: ['remove-rank'],
			desc: 'Remove a rank',
			args: [
				{
					name: 'rank',
					resolver: RoleResolver,
					description: 'The for which you want to remove the rank.'
				}
			],
			group: CommandGroup.Ranks,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[role]: [Role],
		{ guild, t }: Context
	): Promise<any> {
		const rank = await ranks.find({
			where: {
				guildId: role.guild.id,
				roleId: role.id
			}
		});

		if (rank) {
			await rank.destroy();

			this.client.logAction(guild, message, LogAction.removeRank, {
				rankId: rank.id,
				roleId: role.id
			});

			return sendReply(
				this.client,
				message,
				t('CMD_REMOVERANK_DONE', { role: role.name })
			);
		} else {
			return sendReply(
				this.client,
				message,
				t('CMD_REMOVERANK_RANK_NOT_FOUND', { role: role.name })
			);
		}
	}
}
