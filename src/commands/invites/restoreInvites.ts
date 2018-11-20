import { Message, User } from 'eris';
import { In } from 'typeorm';

import { IMClient } from '../../client';
import { CustomInvitesGeneratedReason } from '../../models/CustomInvite';
import { LogAction } from '../../models/Log';
import { UserResolver } from '../../resolvers';
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
		{ guild, t }: Context
	): Promise<any> {
		const memberId = user ? user.id : null;

		const num = await this.repo.customInvs.update(
			{
				guildId: guild.id,
				generatedReason: In([
					CustomInvitesGeneratedReason.clear_regular,
					CustomInvitesGeneratedReason.clear_custom,
					CustomInvitesGeneratedReason.clear_fake,
					CustomInvitesGeneratedReason.clear_leave
				]),
				...(memberId && { memberId })
			},
			{ deletedAt: new Date() }
		);

		this.client.logAction(guild, message, LogAction.restoreInvites, {
			...(memberId && { targetId: memberId }),
			num
		});

		return this.sendReply(
			message,
			t('cmd.restoreInvites.done', { user: user ? user.id : undefined })
		);
	}
}
