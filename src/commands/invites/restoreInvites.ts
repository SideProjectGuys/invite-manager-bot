import { Message, User } from 'eris';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	LogAction
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';
import { UserResolver } from '../resolvers';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.restoreInvites,
			aliases: ['restore-invites', 'unclear-invites', 'unclearInvites'],
			desc: 'Restore all previously cleared invites',
			args: [
				{
					name: 'user',
					resolver: UserResolver,
					description:
						'The user to restore all invites to. ' +
						'If omitted restores invites for all users.'
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[user]: [User],
		{ guild, t }: Context
	): Promise<any> {
		const memberId = user ? user.id : null;

		const num = await customInvites.destroy({
			where: {
				guildId: guild.id,
				generatedReason: [
					CustomInvitesGeneratedReason.clear_regular,
					CustomInvitesGeneratedReason.clear_custom,
					CustomInvitesGeneratedReason.clear_fake,
					CustomInvitesGeneratedReason.clear_leave
				],
				...(memberId && { memberId })
			}
		});

		this.client.logAction(guild, message, LogAction.restoreInvites, {
			...(memberId && { targetId: memberId }),
			num
		});

		return sendReply(
			this.client,
			message,
			t('CMD_RESTOREINVITES_DONE', { user: user ? user.id : undefined })
		);
	}
}
