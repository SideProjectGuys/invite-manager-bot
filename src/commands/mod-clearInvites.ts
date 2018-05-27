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
			usage: '<prefix>clear-invites (@user) (clearBonus)',
			info:
				'`' +
				'@user  The user to clear all invites from\n' +
				`clearBonus  Pass 'true' if you want to also remove bonus invites\n` +
				'`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(resolve('user: User, clearBonus: Boolean'))
	public async action(
		message: Message,
		[user, clearBonus]: [User, boolean]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const memberId = user ? user.id : null;

		// First clear any previous clear_invites customInvites we might have
		await customInvites.destroy({
			where: {
				guildId: message.guild.id,
				generated: true,
				reason: CustomInvitesGeneratedReason.clear_invites,
				...(memberId && { memberId })
			}
		});

		const invs = await inviteCodes.findAll({
			attributes: [
				'inviterId',
				[sequelize.fn('sum', sequelize.col('inviteCode.uses')), 'totalUses']
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

		const uses: { [x: string]: number } = {};
		invs.forEach((inv: any) => {
			if (!uses[inv.inviterId]) {
				uses[inv.inviterId] = 0;
			}
			const totalUses = parseInt(inv.totalUses, 10);
			uses[inv.inviterId] += totalUses;
		});

		if (clearBonus) {
			const customInvs = await customInvites.findAll({
				attributes: [
					'memberId',
					[
						sequelize.fn('sum', sequelize.col('customInvite.amount')),
						'totalAmount'
					]
				],
				where: {
					guildId: message.guild.id,
					...(memberId && { memberId }),
					generatedReason: null
				},
				group: 'customInvite.memberId',
				raw: true
			});

			customInvs.forEach((inv: any) => {
				if (!uses[inv.memberId]) {
					uses[inv.memberId] = 0;
				}
				const totalAmount = parseInt(inv.totalAmount, 10);
				uses[inv.memberId] += totalAmount;
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
