import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { Service } from '../../../framework/decorators/Service';
import { InvitesCache } from '../../cache/InvitesCache';
import { InvitesService } from '../../services/Invites';

export default class extends IMCommand {
	@Service() private invs: InvitesService;
	@Cache() private invitesCache: InvitesCache;

	public constructor(client: IMClient) {
		super(client, {
			name: 'subtractFakes',
			aliases: ['subtract-fakes', 'subfakes', 'sf'],
			group: 'Invites',
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(message: Message, args: any[], flags: {}, { guild, t }: CommandContext): Promise<any> {
		const jIds = await this.invs.getMaxJoinIdsForGuild(guild.id);
		if (jIds.length === 0) {
			return this.sendReply(message, t('cmd.subtractFakes.none'));
		}

		await this.invs.updateJoinInvalidatedReason(
			`CASE WHEN id IN (${jIds.join(',')}) THEN \`invalidatedReason\` ELSE 'fake' END`,
			guild.id
		);

		this.invitesCache.flush(guild.id);

		return this.sendReply(message, t('cmd.subtractFakes.done'));
	}
}
