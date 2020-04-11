import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { Service } from '../../../framework/decorators/Service';
import { LogAction } from '../../../framework/models/Log';
import { UserResolver } from '../../../framework/resolvers';
import { BasicUser } from '../../../types';
import { InvitesCache } from '../../cache/InvitesCache';
import { InvitesService } from '../../services/Invites';

export default class extends IMCommand {
	@Service() private invs: InvitesService;
	@Cache() private invitesCache: InvitesCache;

	public constructor(client: IMClient) {
		super(client, {
			name: 'restoreInvites',
			aliases: ['restore-invites', 'unclear-invites', 'unclearInvites'],
			args: [
				{
					name: 'user',
					resolver: UserResolver
				}
			],
			group: 'Invites',
			guildOnly: true,
			defaultAdminOnly: true,
			extraExamples: ['!restoreInvites @User', '!restoreInvites "User with space"']
		});
	}

	public async action(message: Message, [user]: [BasicUser], flags: {}, { guild, t }: CommandContext): Promise<any> {
		const memberId = user ? user.id : null;

		await this.db.updateInviteCodeClearedAmount(0, guild.id, memberId);

		const codes = memberId ? await this.db.getInviteCodesForMember(guild.id, memberId) : [];

		await this.invs.updateJoinClearedStatus(
			false,
			guild.id,
			codes.map((ic) => ic.code)
		);

		await this.invs.clearCustomInvites(false, guild.id, memberId);

		if (memberId) {
			this.invitesCache.flushOne(guild.id, memberId);
		} else {
			this.invitesCache.flush(guild.id);
		}

		await this.client.logAction(guild, message, LogAction.restoreInvites, {
			...(memberId && { targetId: memberId })
		});

		return this.sendReply(message, t('cmd.restoreInvites.done'));
	}
}
