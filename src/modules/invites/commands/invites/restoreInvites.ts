import { Message } from 'eris';
import { Op } from 'sequelize';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { UserResolver } from '../../../../framework/resolvers';
import {
	customInvites,
	inviteCodes,
	joins,
	LogAction
} from '../../../../sequelize';
import { BasicUser, CommandGroup, InvitesCommand } from '../../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.restoreInvites,
			aliases: ['restore-invites', 'unclear-invites', 'unclearInvites'],
			args: [
				{
					name: 'user',
					resolver: UserResolver
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true,
			strict: true,
			extraExamples: [
				'!restoreInvites @User',
				'!restoreInvites "User with space"'
			]
		});
	}

	public async action(
		message: Message,
		[user]: [BasicUser],
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

		if (memberId) {
			this.client.cache.invites.flushOne(guild.id, memberId);
		} else {
			this.client.cache.invites.flush(guild.id);
		}

		this.client.logAction(guild, message, LogAction.restoreInvites, {
			...(memberId && { targetId: memberId })
		});

		return this.sendReply(message, t('cmd.restoreInvites.done'));
	}
}
