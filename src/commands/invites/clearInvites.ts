import { Message, User } from 'eris';
import { Op } from 'sequelize';

import { IMClient } from '../../client';
import { BooleanResolver, UserResolver } from '../../resolvers';
import {
	CustomInviteAttributes,
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	LogAction,
	sequelize
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.clearInvites,
			aliases: ['clear-invites'],
			args: [
				{
					name: 'clearBonus',
					resolver: BooleanResolver
				},
				{
					name: 'user',
					resolver: UserResolver
				}
			],
			// clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true,
			strict: true
		});
	}

	public async action(
		message: Message,
		[clearBonus, user]: [boolean, User],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		const memberId = user ? user.id : undefined;

		// First clear any previous clearinvites we might have
		await customInvites.destroy({
			where: {
				guildId: guild.id,
				generatedReason: [
					CustomInvitesGeneratedReason.clear_regular,
					CustomInvitesGeneratedReason.clear_custom
				],
				...(memberId && { memberId })
			}
		});

		const invs = await inviteCodes.findAll({
			attributes: [
				'inviterId',
				[sequelize.fn('SUM', sequelize.col('inviteCode.uses')), 'totalUses']
			],
			where: {
				guildId: guild.id,
				inviterId: {
					[Op.ne]: null,
					...(memberId && { [Op.eq]: memberId })
				}
			},
			group: 'inviteCode.inviterId',
			raw: true
		});

		// Get all custom generated invites (all clear_invites were removed before)
		const customInvs = await customInvites.findAll({
			attributes: [
				'memberId',
				'generatedReason',
				[sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
			],
			where: {
				guildId: guild.id,
				memberId: {
					[Op.ne]: null,
					...(memberId && { [Op.eq]: memberId })
				}
			},
			group: ['memberId', 'generatedReason'],
			raw: true
		});

		const regular: { [x: string]: number } = {};
		const custom: { [x: string]: number } = {};

		invs.forEach((inv: any) => {
			if (!regular[inv.inviterId]) {
				regular[inv.inviterId] = 0;
			}
			regular[inv.inviterId] += parseInt(inv.totalUses, 10);
		});

		const cleared: { [x: string]: boolean } = {};
		const newInvs: CustomInviteAttributes[] = [];
		Object.keys(regular).forEach(memId => {
			newInvs.push({
				id: null,
				guildId: guild.id,
				memberId: memId,
				creatorId: null,
				amount: -regular[memId],
				reason: null,
				generatedReason: CustomInvitesGeneratedReason.clear_regular
			});
			cleared[memId] = true;
		});

		if (clearBonus) {
			// Process any custom invites
			customInvs
				.filter(inv => inv.generatedReason === null)
				.forEach((inv: any) => {
					if (!custom[inv.memberId]) {
						custom[inv.memberId] = 0;
					}
					custom[inv.memberId] += parseInt(inv.totalAmount, 10);
				});

			Object.keys(custom).forEach(memId => {
				newInvs.push({
					id: null,
					guildId: guild.id,
					memberId: memId,
					creatorId: null,
					amount: -custom[memId],
					reason: null,
					generatedReason: CustomInvitesGeneratedReason.clear_custom
				});
				cleared[memId] = true;
			});
		}

		const createdInvs = await customInvites.bulkCreate(newInvs);

		this.client.logAction(guild, message, LogAction.clearInvites, {
			customInviteIds: createdInvs.map(inv => inv.id),
			...(memberId && { targetId: memberId })
		});

		return this.client.sendReply(
			message,
			t('cmd.clearInvites.done', {
				amount: Object.keys(cleared).length
			})
		);
	}
}
