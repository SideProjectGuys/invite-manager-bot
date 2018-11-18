import { Message } from 'eris';
import { getRepository, Repository } from 'typeorm';

import { IMClient } from '../../client';
import { Rank } from '../../models/Rank';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	private ranksRepo: Repository<Rank>;

	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.ranks,
			aliases: ['show-ranks', 'showRanks'],
			group: CommandGroup.Ranks,
			guildOnly: true
		});

		this.ranksRepo = getRepository(Rank);
	}

	public async action(
		message: Message,
		args: any[],
		{ guild, t }: Context
	): Promise<any> {
		const rs = await this.ranksRepo.find({
			where: {
				guildId: guild.id,
				deletedAt: null
			},
			order: {
				numInvites: 'ASC'
			}
		});

		let output = '';

		if (rs.length === 0) {
			return this.client.sendReply(message, t('cmd.ranks.none'));
		} else {
			rs.forEach(r => {
				output +=
					t('cmd.ranks.entry', {
						role: `<@&${r.roleId}>`,
						numInvites: r.numInvites,
						description: r.description
					}) + '\n';
			});
			const embed = this.client.createEmbed({
				title: t('cmd.ranks.title'),
				description: output
			});

			return this.client.sendReply(message, embed);
		}
	}
}
