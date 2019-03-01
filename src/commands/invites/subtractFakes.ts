import { Message } from 'eris';

import { IMClient } from '../../client';
import { joins, sequelize } from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.subtractFakes,
			aliases: ['subtract-fakes', 'subfakes', 'sf'],
			group: CommandGroup.Invites,
			guildOnly: true,
			strict: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		const maxJoins = await joins.findAll({
			attributes: [
				[sequelize.fn('MAX', sequelize.col('id')), 'id'],
				'exactMatchCode'
			],
			group: ['exactMatchCode', 'memberId'],
			where: { guildId: guild.id },
			raw: true
		});

		if (maxJoins.length === 0) {
			return this.sendReply(message, t('cmd.subtractFakes.none'));
		}

		const jIds = maxJoins.map(j => j.id).join(', ');
		await joins.update(
			{
				invalidatedReason: sequelize.literal(
					`CASE WHEN id IN (${jIds}) THEN invalidatedReason ELSE 'fake' END`
				) as any
			},
			{
				where: {
					guildId: guild.id
				}
			}
		);

		return this.sendReply(message, t('cmd.subtractFakes.done'));
	}
}
