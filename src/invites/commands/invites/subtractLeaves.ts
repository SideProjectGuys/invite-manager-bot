import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { Service } from '../../../framework/decorators/Service';
import { InvitesCache } from '../../cache/InvitesCache';
import { InvitesGuildSettings } from '../../models/GuildSettings';
import { InvitesService } from '../../services/Invites';

export default class extends IMCommand {
	@Service() private invs: InvitesService;
	@Cache() private invitesCache: InvitesCache;

	public constructor(client: IMClient) {
		super(client, {
			name: 'subtractLeaves',
			aliases: ['subtract-leaves', 'subleaves', 'sl'],
			group: 'Invites',
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		flags: {},
		{ guild, t, settings }: CommandContext<InvitesGuildSettings>
	): Promise<any> {
		await this.invs.subtractLeaves(guild.id, settings.autoSubtractLeaveThreshold);

		this.invitesCache.flush(guild.id);

		return this.sendReply(message, t('cmd.subtractLeaves.done'));
	}
}
