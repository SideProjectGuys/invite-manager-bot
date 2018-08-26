import { Message } from 'eris';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	sequelize
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.subtractFakes,
			aliases: ['subtract-fakes', 'subfakes', 'sf'],
			desc: 'Remove fake invites from all users',
			// clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ guild, t }: Context
	): Promise<any> {
		const js = await joins.findAll({
			attributes: [
				'memberId',
				[sequelize.fn('COUNT', sequelize.col('exactMatch.code')), 'numJoins'],
				[sequelize.fn('MAX', sequelize.col('join.createdAt')), 'newestJoinAt']
			],
			where: {
				guildId: guild.id
			},
			group: [sequelize.col('join.memberId'), sequelize.col('exactMatch.code')],
			include: [
				{
					attributes: ['code', 'inviterId'],
					model: inviteCodes,
					as: 'exactMatch',
					required: true
				}
			],
			raw: true
		});

		if (js.length === 0) {
			return sendReply(this.client, message, t('CMD_SUBTRACTFAKES_NO_INVITES'));
		}

		// Delete old duplicate removals
		await customInvites.destroy({
			where: {
				guildId: guild.id,
				generatedReason: CustomInvitesGeneratedReason.fake
			}
		});

		// Add subtracts for duplicate invites
		const customInvs = js
			.filter((j: any) => parseInt(j.numJoins, 10) > 1)
			.map((j: any) => ({
				id: null,
				guildId: guild.id,
				memberId: j['exactMatch.inviterId'],
				creatorId: null,
				amount: -(parseInt(j.numJoins, 10) - 1),
				reason: j.memberId,
				generatedReason: CustomInvitesGeneratedReason.fake
			}));
		await customInvites.bulkCreate(customInvs, {
			updateOnDuplicate: ['amount', 'updatedAt']
		});

		const total = -customInvs.reduce((acc, inv) => acc + inv.amount, 0);
		return sendReply(
			this.client,
			message,
			t('CMD_SUBTRACTFAKES_DONE', { total })
		);
	}
}
