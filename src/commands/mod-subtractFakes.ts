import { Command, Logger, logger, Message } from 'yamdbf';

import { IMClient } from '../client';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	sequelize
} from '../sequelize';
import { CommandGroup } from '../utils/util';

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'subtract-fakes',
			aliases: ['subtractfakes', 'subfakes', 'sf'],
			desc: 'Remove fake invites from all users',
			usage: '<prefix>subtract-fakes',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			clientPermissions: ['MANAGE_GUILD'],
			group: CommandGroup.Admin,
			guildOnly: true
		});
	}

	public async action(message: Message, [_page]: [number]): Promise<any> {
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
			await message.channel.send(`There have been no invites so far!`);
			return;
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
		await message.channel.send(`Removed ${total} fake invites!`);
	}
}
