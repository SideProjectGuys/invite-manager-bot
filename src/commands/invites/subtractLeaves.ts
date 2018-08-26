import { Message } from 'eris';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	leaves,
	sequelize
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.subtractLeaves,
			aliases: ['subtract-leaves', 'subleaves', 'sl'],
			desc: 'Remove leaves from all users',
			// clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ guild, t, settings }: Context
	): Promise<any> {
		const ls = await leaves.findAll({
			attributes: [
				'memberId',
				[
					sequelize.fn(
						'TIMESTAMPDIFF',
						sequelize.literal('SECOND'),
						sequelize.fn('MAX', sequelize.col('join.createdAt')),
						sequelize.fn('MAX', sequelize.col('leave.createdAt'))
					),
					'timeDiff'
				]
			],
			where: {
				guildId: guild.id
			},
			group: [
				sequelize.col('leave.memberId'),
				sequelize.col('join->exactMatch.code')
			],
			include: [
				{
					attributes: [],
					model: joins,
					required: true,
					include: [
						{
							attributes: ['code', 'inviterId'],
							model: inviteCodes,
							as: 'exactMatch',
							required: true
						}
					]
				}
			],
			raw: true
		});

		if (ls.length === 0) {
			return sendReply(this.client, message, t('CMD_SUBTRACTLEAVES_NO_LEAVES'));
		}

		// Delete old duplicate removals
		await customInvites.destroy({
			where: {
				guildId: guild.id,
				generatedReason: CustomInvitesGeneratedReason.leave
			}
		});

		const threshold = parseInt(settings.autoSubtractLeaveThreshold, 10);

		// Add subtracts for leaves
		const customInvs = ls
			.filter((l: any) => parseInt(l.timeDiff, 10) < threshold)
			.map((l: any) => ({
				id: null,
				guildId: guild.id,
				memberId: l['join.exactMatch.inviterId'],
				creatorId: null,
				amount: -1,
				reason: l.memberId,
				generatedReason: CustomInvitesGeneratedReason.leave
			}));
		await customInvites.bulkCreate(customInvs, {
			updateOnDuplicate: ['amount', 'updatedAt']
		});

		return sendReply(
			this.client,
			message,
			t('CMD_SUBTRACTLEAVES_DONE', { total: customInvs.length })
		);
	}
}
