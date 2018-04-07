import { Client, Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { CustomInviteAttributes, CustomInviteInstance, customInvites, inviteCodes, sequelize } from '../sequelize';

const { resolve } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'clearInvites',
			aliases: ['clear-invites'],
			desc: 'Clear all previous invites!',
			usage: '<prefix>clearInvites (clearBonus)',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			clientPermissions: ['MANAGE_GUILD'],
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
		});

		let total = 0;
		const uses: { [x: string]: number } = {};
		invs.forEach(inv => {
			if (!uses[inv.inviterId]) {
				uses[inv.inviterId] = 0;
			}
			const totalUses = parseInt(inv.get('totalUses'), 10);
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
			});

			customInvs.forEach(inv => {
				if (!uses[inv.memberId]) {
					uses[inv.memberId] = 0;
				}
				const totalAmount = parseInt(inv.get('totalAmount'), 10);
				total += totalAmount;
				uses[inv.memberId] += totalAmount;
			});
		}

		console.log(uses);

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

		await customInvites.bulkCreate(newInvs);

		message.channel.send(`Cleared ${total} invites!`);
	}
}
