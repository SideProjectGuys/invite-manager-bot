import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { ranks } from '../../../../sequelize';
import { BotCommand, CommandGroup } from '../../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.ranks,
			aliases: ['show-ranks', 'showRanks'],
			group: CommandGroup.Ranks,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		flags: {},
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
			return this.sendReply(message, t('cmd.ranks.none'));
		} else {
			rs.forEach(r => {
				output +=
					t('cmd.ranks.entry', {
						role: `<@&${r.roleId}>`,
						numInvites: r.numInvites,
						description: r.description
					}) + '\n';
			});
			const embed = this.createEmbed({
				title: t('cmd.ranks.title'),
				description: output
			});

			return this.sendReply(message, embed);
		}
	}
}
