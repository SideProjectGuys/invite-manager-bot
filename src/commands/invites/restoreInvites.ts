import { Message, User } from 'eris';
import { Op } from 'sequelize';

import { IMClient } from '../../client';
import { UserResolver } from '../../resolvers';
import {
	customInvites,
	inviteCodes,
	joins,
	LogAction,
	sequelize
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.restoreInvites,
			aliases: ['restore-invites', 'unclear-invites', 'unclearInvites'],
			args: [
				{
					name: 'user',
					resolver: UserResolver
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true,
			strict: true
		});
	}

	public async action(
		message: Message,
		[user]: [User],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		const memberId = user ? user.id : null;

		await inviteCodes.update(
			{
				clearedAmount: 0
			},
			{
				where: {
					guildId: guild.id,
					inviterId: memberId ? memberId : { [Op.ne]: null }
				}
			}
		);

		await joins.update(
			{
				cleared: false
			},
			{
				where: {
					guildId: guild.id,
					...(memberId && {
						exactMatchCode: (await inviteCodes.findAll({
							where: { guildId: guild.id, inviterId: memberId }
						})).map(ic => ic.code)
					})
				}
			}
		);

		await customInvites.update(
			{
				cleared: false
			},
			{
				where: {
					guildId: guild.id,
					...(memberId && { memberId })
				}
			}
		);

		this.client.logAction(guild, message, LogAction.restoreInvites, {
			...(memberId && { targetId: memberId })
		});

		return this.client.sendReply(message, t('cmd.restoreInvites.done'));
	}
}
