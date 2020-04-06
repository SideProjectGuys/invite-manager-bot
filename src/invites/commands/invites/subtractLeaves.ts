import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { CommandGroup, InvitesCommand } from '../../../types';
import { InvitesCache } from '../../cache/InvitesCache';

export default class extends IMCommand {
	@Cache() private invitesCache: InvitesCache;

	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.subtractLeaves,
			aliases: ['subtract-leaves', 'subleaves', 'sl'],
			group: CommandGroup.Invites,
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(message: Message, args: any[], flags: {}, { guild, t, settings }: CommandContext): Promise<any> {
		await this.db.subtractLeaves(guild.id, settings.autoSubtractLeaveThreshold);

		this.invitesCache.flush(guild.id);

		return this.sendReply(message, t('cmd.subtractLeaves.done'));
	}
}
