import { Message } from 'eris';

import { IMClient } from '../../client';
import { ranks } from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.ranks,
			aliases: ['show-ranks', 'showRanks'],
			desc: 'Show all ranks.',
			group: CommandGroup.Ranks,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ guild, t }: Context
	): Promise<any> {
		const rs = await ranks.findAll({
			where: {
				guildId: guild.id
			},
			order: ['numInvites'],
			raw: true
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
