import { Message, Role } from 'eris';
import { getRepository, Repository } from 'typeorm';

import { IMClient } from '../../client';
import { LogAction } from '../../models/Log';
import { Rank } from '../../models/Rank';
import { RoleResolver } from '../../resolvers';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	private ranksRepo: Repository<Rank>;

	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.removeRank,
			aliases: ['remove-rank'],
			args: [
				{
					name: 'rank',
					resolver: RoleResolver
				}
			],
			group: CommandGroup.Ranks,
			guildOnly: true,
			strict: true
		});

		this.ranksRepo = getRepository(Rank);
	}

	public async action(
		message: Message,
		[role]: [Role],
		{ guild, t }: Context
	): Promise<any> {
		const rank = await this.ranksRepo.findOne({
			where: {
				guildId: role.guild.id,
				roleId: role.id
			}
		});

		if (rank) {
			rank.deletedAt = new Date();
			await this.ranksRepo.save(rank);

			this.client.logAction(guild, message, LogAction.removeRank, {
				rankId: rank.id,
				roleId: role.id
			});

			return this.client.sendReply(
				message,
				t('cmd.removeRank.done', { role: `<@&${role.id}>` })
			);
		} else {
			return this.client.sendReply(
				message,
				t('cmd.removeRank.rankNotFound', { role: `<@&${role.id}>` })
			);
		}
	}
}
