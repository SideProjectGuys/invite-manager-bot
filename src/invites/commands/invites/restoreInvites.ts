import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { LogAction } from '../../../framework/models/Log';
import { UserResolver } from '../../../framework/resolvers';
import { BasicUser, CommandGroup, InvitesCommand } from '../../../types';

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
			defaultAdminOnly: true,
			extraExamples: ['!restoreInvites @User', '!restoreInvites "User with space"']
		});
	}

	public async action(message: Message, [user]: [BasicUser], flags: {}, { guild, t }: Context): Promise<any> {
		const memberId = user ? user.id : null;

		await this.client.db.updateInviteCodeClearedAmount(0, guild.id, memberId);

		const codes = memberId ? await this.client.db.getInviteCodesForMember(guild.id, memberId) : [];

		await this.client.db.updateJoinClearedStatus(
			false,
			guild.id,
			codes.map((ic) => ic.code)
		);

		await this.client.db.clearCustomInvites(false, guild.id, memberId);

		if (memberId) {
			this.client.cache.invites.flushOne(guild.id, memberId);
		} else {
			this.client.cache.invites.flush(guild.id);
		}

		await this.client.logAction(guild, message, LogAction.restoreInvites, {
			...(memberId && { targetId: memberId })
		});

		return this.sendReply(message, t('cmd.restoreInvites.done'));
	}
}
