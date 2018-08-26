import { Message } from 'eris';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
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
			return sendReply(this.client, message, t('CMD_RANKS_NONE'));
		} else {
			rs.forEach(r => {
				output +=
					t('CMD_RANKS_ENTRY', {
						role: r.roleId,
						numInvites: r.numInvites,
						description: r.description ? ': ' + r.description : undefined
					}) + '\n';
			});
			const embed = createEmbed(this.client, {
				title: t('CMD_RANKS_TITLE'),
				description: output
			});

			return sendReply(this.client, message, embed);
		}
	}
}
