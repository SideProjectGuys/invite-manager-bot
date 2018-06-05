import { User } from 'discord.js';
import { Op } from 'sequelize';
import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from 'yamdbf';

import { IMClient } from '../client';
import {
	CustomInviteAttributes,
	CustomInviteInstance,
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	LogAction,
	sequelize
} from '../sequelize';
import { CommandGroup } from '../utils/util';

const { resolve } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

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
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(resolve('clearBonus: Boolean, user: User'))
	public async action(
		message: Message,
		[clearBonus, user]: [boolean, User]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const memberId = user ? user.id : undefined;

		// First clear any previous clearinvites we might have
		await customInvites.destroy({
			where: {
				guildId: message.guild.id,
				generatedReason: CustomInvitesGeneratedReason.clear_invites,
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
				...(memberId && { memberId })
			},
			group: ['memberId', 'generatedReason'],
			raw: true
		});

		const uses: { [x: string]: number } = {};
		invs.forEach((inv: any) => {
			if (!uses[inv.inviterId]) {
				uses[inv.inviterId] = 0;
			}
			uses[inv.inviterId] += parseInt(inv.totalUses, 10);
		});
		customInvs
			.filter(inv => inv.generatedReason !== null)
			.forEach((inv: any) => {
				if (!uses[inv.memberId]) {
					uses[inv.memberId] = 0;
				}
				uses[inv.memberId] += parseInt(inv.totalAmount, 10);
			});

		console.log(clearBonus);
		if (clearBonus) {
			customInvs
				.filter(inv => inv.generatedReason === null)
				.forEach((inv: any) => {
					if (!uses[inv.memberId]) {
						uses[inv.memberId] = 0;
					}
					uses[inv.memberId] += parseInt(inv.totalAmount, 10);
				});
		}

		const newInvs: CustomInviteAttributes[] = [];
		Object.keys(uses).forEach(memId => {
			newInvs.push({
				id: null,
				guildId: message.guild.id,
				memberId: memId,
				creatorId: null,
				amount: -uses[memId],
				reason: null,
				generatedReason: CustomInvitesGeneratedReason.clear_invites
			});
		});

		const createdInvs = await customInvites.bulkCreate(newInvs);

		this.client.logAction(message, LogAction.clearInvites, {
			customInviteIds: createdInvs.map(inv => inv.id),
			...(memberId && { targetId: memberId })
		});

		message.channel.send(`Cleared invites for ${createdInvs.length} users!`);
	}
}
