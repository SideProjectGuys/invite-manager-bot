import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';

import { IMClient } from '../../client';
import { checkProBot, checkRoles } from '../../middleware';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	leaves,
	sequelize
} from '../../sequelize';
import { SettingsCache } from '../../storage/SettingsCache';
import { BotCommand, CommandGroup, RP } from '../../types';
import { sendReply } from '../../functions/Messaging';

const { localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'subtract-leaves',
			aliases: ['subtractleaves', 'subleaves', 'sl'],
			desc: 'Remove leaves from all users',
			usage: '<prefix>subtract-leaves',
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.subtractLeaves))
	@using(localize)
	public async action(
		message: Message,
		[rp, _page]: [RP, number]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const ls = await leaves.findAll({
			attributes: [
				'memberId',
				[
					sequelize.fn(
						'TIMESTAMPDIFF',
						sequelize.literal('SECOND'),
						sequelize.fn('MAX', sequelize.col('join.createdAt')),
						sequelize.fn('MAX', sequelize.col('leave.createdAt'))
					),
					'timeDiff'
				]
			],
			where: {
				guildId: message.guild.id
			},
			group: [
				sequelize.col('leave.memberId'),
				sequelize.col('join->exactMatch.code')
			],
			include: [
				{
					attributes: [],
					model: joins,
					required: true,
					include: [
						{
							attributes: ['code', 'inviterId'],
							model: inviteCodes,
							as: 'exactMatch',
							required: true
						}
					]
				}
			],
			raw: true
		});

		if (ls.length === 0) {
			return sendReply(message, rp.CMD_SUBTRACTLEAVES_NO_LEAVES());
		}

		// Delete old duplicate removals
		await customInvites.destroy({
			where: {
				guildId: message.guild.id,
				generatedReason: CustomInvitesGeneratedReason.leave
			}
		});

		const threshold = (await SettingsCache.get(message.guild.id))
			.autoSubtractLeaveThreshold;

		// Add subtracts for leaves
		const customInvs = ls
			.filter((l: any) => parseInt(l.timeDiff, 10) < threshold)
			.map((l: any) => ({
				id: null,
				guildId: message.guild.id,
				memberId: l['join.exactMatch.inviterId'],
				creatorId: null,
				amount: -1,
				reason: l.memberId,
				generatedReason: CustomInvitesGeneratedReason.leave
			}));
		await customInvites.bulkCreate(customInvs, {
			updateOnDuplicate: ['amount', 'updatedAt']
		});

		return sendReply(
			message,
			rp.CMD_SUBTRACTLEAVES_DONE({ total: customInvs.length })
		);
	}
}
