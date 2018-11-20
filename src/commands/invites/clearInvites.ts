import { Message, User } from 'eris';
import { In } from 'typeorm';

import { IMClient } from '../../client';
import {
	CustomInvite,
	CustomInvitesGeneratedReason
} from '../../models/CustomInvite';
import { LogAction } from '../../models/Log';
import { BooleanResolver, UserResolver } from '../../resolvers';
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
		{ guild, t }: Context
	): Promise<any> {
		const memberId = user ? user.id : undefined;

		// First clear any previous clearinvites we might have
		await this.repo.customInvs.update(
			{
				guildId: guild.id,
				generatedReason: In([
					CustomInvitesGeneratedReason.clear_regular,
					CustomInvitesGeneratedReason.clear_custom,
					CustomInvitesGeneratedReason.clear_fake,
					CustomInvitesGeneratedReason.clear_leave
				]),
				...(memberId && { memberId })
			},
			{
				deletedAt: new Date()
			}
		);

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
		const fake: { [x: string]: number } = {};
		const leave: { [x: string]: number } = {};
		const custom: { [x: string]: number } = {};

		invs.forEach((inv: any) => {
			if (!regular[inv.inviterId]) {
				regular[inv.inviterId] = 0;
			}
			regular[inv.inviterId] += parseInt(inv.totalUses, 10);
		});
		customInvs
			.filter(inv => inv.generatedReason === CustomInvitesGeneratedReason.fake)
			.forEach((inv: any) => {
				if (!fake[inv.memberId]) {
					fake[inv.memberId] = 0;
				}
				fake[inv.memberId] += parseInt(inv.totalAmount, 10);
			});
		customInvs
			.filter(inv => inv.generatedReason === CustomInvitesGeneratedReason.leave)
			.forEach((inv: any) => {
				if (!leave[inv.memberId]) {
					leave[inv.memberId] = 0;
				}
				leave[inv.memberId] += parseInt(inv.totalAmount, 10);
			});

		const cleared: { [x: string]: boolean } = {};
		const newInvs: Partial<CustomInvite>[] = [];
		Object.keys(regular).forEach(memId => {
			newInvs.push({
				guildId: guild.id,
				memberId: memId,
				creatorId: null,
				amount: -regular[memId],
				reason: null,
				generatedReason: CustomInvitesGeneratedReason.clear_regular
			});
			cleared[memId] = true;
		});
		Object.keys(fake).forEach(memId => {
			newInvs.push({
				guildId: guild.id,
				memberId: memId,
				creatorId: null,
				amount: -fake[memId],
				reason: null,
				generatedReason: CustomInvitesGeneratedReason.clear_fake
			});
			cleared[memId] = true;
		});
		Object.keys(leave).forEach(memId => {
			newInvs.push({
				guildId: guild.id,
				memberId: memId,
				creatorId: null,
				amount: -leave[memId],
				reason: null,
				generatedReason: CustomInvitesGeneratedReason.clear_leave
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

		const createdInvs = await this.repo.customInvs.save(newInvs);

		this.client.logAction(guild, message, LogAction.clearInvites, {
			customInviteIds: createdInvs.map(inv => inv.id),
			...(memberId && { targetId: memberId })
		});

		return this.sendReply(
			message,
			t('cmd.clearInvites.done', {
				amount: Object.keys(cleared).length
			})
		);
	}
}
