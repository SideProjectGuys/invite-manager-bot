import { Message } from 'eris';
import { Moment } from 'moment';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { LogAction } from '../../../framework/models/Log';
import { BooleanResolver, DateResolver, UserResolver } from '../../../framework/resolvers';
import { BasicUser, CommandGroup, InvitesCommand } from '../../../types';
import { InvitesCache } from '../../cache/InvitesCache';

export default class extends IMCommand {
	@Cache() private invitesCache: InvitesCache;

	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.clearInvites,
			aliases: ['clear-invites'],
			args: [
				{
					name: 'user',
					resolver: UserResolver
				}
			],
			flags: [
				{
					name: 'date',
					resolver: DateResolver,
					short: 'd'
				},
				{
					name: 'clearBonus',
					resolver: BooleanResolver,
					short: 'cb'
				}
			],
			group: CommandGroup.Invites,
			guildOnly: true,
			defaultAdminOnly: true,
			extraExamples: ['!clearInvites @User', '!clearInvites -cb "User with space"']
		});
	}

	public async action(
		message: Message,
		[user]: [BasicUser],
		{ date, clearBonus }: { date: Moment; clearBonus: boolean },
		{ guild, t }: CommandContext
	): Promise<any> {
		const memberId = user ? user.id : undefined;

		await this.db.updateInviteCodeClearedAmount('uses', guild.id, memberId);

		const codes = memberId ? await this.db.getInviteCodesForMember(guild.id, memberId) : [];

		await this.db.updateJoinClearedStatus(
			true,
			guild.id,
			codes.map((ic) => ic.code)
		);

		if (clearBonus) {
			// Clear invites
			await this.db.clearCustomInvites(true, guild.id, memberId);
		} else {
			await this.db.clearCustomInvites(false, guild.id, memberId);
		}

		if (memberId) {
			this.invitesCache.flushOne(guild.id, memberId);
		} else {
			this.invitesCache.flush(guild.id);
		}

		await this.client.logAction(guild, message, LogAction.clearInvites, {
			clearBonus,
			...(memberId && { targetId: memberId })
		});

		return this.sendReply(message, t('cmd.clearInvites.done'));
	}
}
