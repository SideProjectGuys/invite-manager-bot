import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	sequelize
} from '../../sequelize';
import { BotCommand, CommandGroup, RP } from '../../types';

const { localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'subtract-fakes',
			aliases: ['subtractfakes', 'subfakes', 'sf'],
			desc: 'Remove fake invites from all users',
			usage: '<prefix>subtract-fakes',
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.subtractFakes))
	@using(localize)
	public async action(
		message: Message,
		[rp, _page]: [RP, number]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const js = await joins.findAll({
			attributes: [
				'memberId',
				[sequelize.fn('COUNT', sequelize.col('exactMatch.code')), 'numJoins'],
				[sequelize.fn('MAX', sequelize.col('join.createdAt')), 'newestJoinAt']
			],
			where: {
				guildId: message.guild.id
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
			return sendReply(message, rp.CMD_SUBTRACTFAKES_NO_INVITES());
		}

		// Delete old duplicate removals
		await customInvites.destroy({
			where: {
				guildId: message.guild.id,
				generatedReason: CustomInvitesGeneratedReason.fake
			}
		});

		// Add subtracts for duplicate invites
		const customInvs = js
			.filter((j: any) => parseInt(j.numJoins, 10) > 1)
			.map((j: any) => ({
				id: null,
				guildId: message.guild.id,
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
		return sendReply(message, rp.CMD_SUBTRACTFAKES_DONE({ total }));
	}
}
