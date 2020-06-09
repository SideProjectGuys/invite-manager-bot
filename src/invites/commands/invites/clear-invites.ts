import { Message } from 'eris';
import { Moment } from 'moment';

import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { Service } from '../../../framework/decorators/Service';
import { LogAction } from '../../../framework/models/Log';
import { IMModule } from '../../../framework/Module';
import { BooleanResolver, DateResolver, UserResolver } from '../../../framework/resolvers';
import { BasicUser } from '../../../types';
import { InvitesCache } from '../../cache/InvitesCache';
import { InvitesService } from '../../services/Invites';

export default class extends IMCommand {
	@Service() private invs: InvitesService;
	@Cache() private invitesCache: InvitesCache;

	public constructor(module: IMModule) {
		super(module, {
			name: 'clearInvites',
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
			group: 'Invites',
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

		await this.invs.updateJoinClearedStatus(
			true,
			guild.id,
			codes.map((ic) => ic.code)
		);

		// Clear invites
		await this.invs.clearCustomInvites(clearBonus, guild.id, memberId);

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
