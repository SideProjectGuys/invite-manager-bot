import { Message, Role } from 'eris';

import { IMClient } from '../../client';
import { RoleResolver } from '../../resolvers';
import { LogAction, ranks } from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

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
			guildOnly: true,
			strict: true
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

			return this.client.sendReply(
				message,
				t('cmd.removeRank.done', { role: `<@!${role.id}>` })
			);
		} else {
			return this.client.sendReply(
				message,
				t('cmd.removeRank.rankNotFound', { role: `<@!${role.id}>` })
			);
		}
	}
}
