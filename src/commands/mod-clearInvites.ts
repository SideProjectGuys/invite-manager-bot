import { User } from 'discord.js';
import { Op } from 'sequelize';
import { Client, Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import {
	CustomInviteAttributes,
	CustomInviteInstance,
	customInvites,
	inviteCodes,
	LogAction,
	sequelize
} from '../sequelize';
import { CommandGroup, logAction } from '../utils/util';

const { resolve } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<Client> {
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
				"clearBonus  Pass 'true' if you want to also remove bonus invites\n" +
				'`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(resolve('user: User, clearBonus: Boolean'))
	public async action(message: Message, [user, clearBonus]: [User, boolean]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		const memberId = user ? user.id : null;

		// First clear any previous clear_invites customInvites we might have
		await customInvites.destroy({
			where: {
				guildId: message.guild.id,
				generated: true,
				reason: 'clear_invites',
				...(memberId && { memberId })
			}
		});

		const invs = await inviteCodes.findAll({
			attributes: ['inviterId', [sequelize.fn('sum', sequelize.col('inviteCode.uses')), 'totalUses']],
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
				attributes: ['memberId', [sequelize.fn('sum', sequelize.col('customInvite.amount')), 'totalAmount']],
				where: {
					guildId: message.guild.id,
					...(memberId && { memberId }),
					generated: false
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
				memberId: memId,
				amount: -uses[memId],
				reason: 'clear_invites',
				generated: true,
				guildId: message.guild.id,
				creatorId: null
			});
		});

		const createdInvs = await customInvites.bulkCreate(newInvs);

		await logAction(message, LogAction.clearInvites, {
			customInviteIds: createdInvs.map(inv => inv.id),
			...(memberId && { targetId: memberId })
		});

		message.channel.send(`Cleared invites for ${createdInvs.length} users!`);
	}
}
