import { Client, Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import {
	ActivityAction, CustomInviteAttributes, CustomInviteInstance,
	customInvites, inviteCodes, sequelize
} from '../sequelize';
import { CommandGroup, logAction } from '../utils/util';

const { resolve } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'clear-invites',
			aliases: ['clearInvites'],
			desc: 'Clear all invites on the server',
			usage: '<prefix>clear-invites (clearBonus)',
			info: '`' +
				'clearBonus  Pass \'true\' if you want to also remove bonus invites\n' +
				'`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(resolve('clearBonus: Boolean'))
	public async action(message: Message, [clearBonus]: [boolean]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		// First clear any previous clear_invites customInvites we might have
		await customInvites.destroy({
			where: {
				guildId: message.guild.id,
				generated: true,
				reason: 'clear_invites',
			}
		});

		const invs = await inviteCodes.findAll({
			attributes: [
				'inviterId',
				[sequelize.fn('sum', sequelize.col('inviteCode.uses')), 'totalUses']
			],
			where: {
				guildId: message.guild.id,
			},
			group: 'inviteCode.inviterId',
			raw: true,
		});

		let total = 0;
		const uses: { [x: string]: number } = {};
		invs.forEach((inv: any) => {
			if (!uses[inv.inviterId]) {
				uses[inv.inviterId] = 0;
			}
			const totalUses = parseInt(inv.totalUses, 10);
			total += totalUses;
			uses[inv.inviterId] += totalUses;
		});

		if (clearBonus) {
			const customInvs = await customInvites.findAll({
				attributes: [
					'memberId',
					[sequelize.fn('sum', sequelize.col('customInvite.amount')), 'totalAmount']
				],
				where: {
					guildId: message.guild.id,
					generated: false,
				},
				group: 'customInvite.memberId',
				raw: true,
			});

			customInvs.forEach((inv: any) => {
				if (!uses[inv.memberId]) {
					uses[inv.memberId] = 0;
				}
				const totalAmount = parseInt(inv.totalAmount, 10);
				total += totalAmount;
				uses[inv.memberId] += totalAmount;
			});
		}

		const newInvs: CustomInviteAttributes[] = [];
		Object.keys(uses).forEach(memberId => {
			newInvs.push({
				id: null,
				memberId,
				amount: -uses[memberId],
				reason: 'clear_invites',
				generated: true,
				guildId: message.guild.id,
				creatorId: null,
			});
		});

		const createdInvs = await customInvites.bulkCreate(newInvs);

		await logAction(ActivityAction.clearInvites, message.guild.id, message.author.id, {
			customInviteIds: createdInvs.map(inv => inv.id),
		});

		message.channel.send(`Cleared ${total} invites!`);
	}
}
