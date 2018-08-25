import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { User } from 'discord.js';
import { Op } from 'sequelize';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import {
	CustomInviteAttributes,
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	LogAction,
	sequelize
} from '../../sequelize';
import { BotCommand, CommandGroup, RP } from '../../types';

const { resolve, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'clear-invites',
			aliases: ['clearInvites'],
			desc: 'Clear invites of the server/a user',
			usage: '<prefix>clear-invites (clearBonus) (@user)',
			info:
				'`clearBonus`:\n' +
				'Pass `true` if you want to remove bonus invites, otherwise `false` (default).\n\n' +
				'`@user`:\n' +
				'The user to clear all invites from. If omitted clears all users.\n\n',
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.clearInvites))
	@using(resolve('clearBonus: Boolean, user: User'))
	@using(localize)
	public async action(
		message: Message,
		[rp, clearBonus, user]: [RP, boolean, User]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const memberId = user ? user.id : undefined;

		// First clear any previous clearinvites we might have
		await customInvites.destroy({
			where: {
				guildId: message.guild.id,
				generatedReason: [
					CustomInvitesGeneratedReason.clear_regular,
					CustomInvitesGeneratedReason.clear_custom,
					CustomInvitesGeneratedReason.clear_fake,
					CustomInvitesGeneratedReason.clear_leave
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
				guildId: message.guild.id,
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
				guildId: message.guild.id,
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
		const newInvs: CustomInviteAttributes[] = [];
		Object.keys(regular).forEach(memId => {
			newInvs.push({
				id: null,
				guildId: message.guild.id,
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
				id: null,
				guildId: message.guild.id,
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
				id: null,
				guildId: message.guild.id,
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
					guildId: message.guild.id,
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

		this.client.logAction(message, LogAction.clearInvites, {
			customInviteIds: createdInvs.map(inv => inv.id),
			...(memberId && { targetId: memberId })
		});

		return sendReply(
			message,
			rp.CMD_CLEARINVITES_DONE({
				amount: Object.keys(cleared).length
			})
		);
	}
}
