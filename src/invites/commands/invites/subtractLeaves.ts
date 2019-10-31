import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { CommandGroup, InvitesCommand } from '../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.subtractLeaves,
			aliases: ['subtract-leaves', 'subleaves', 'sl'],
			group: CommandGroup.Invites,
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(message: Message, args: any[], flags: {}, { guild, t, settings }: Context): Promise<any> {
		await this.client.db.subtractLeaves(guild.id, settings.autoSubtractLeaveThreshold);

		this.client.cache.invites.flush(guild.id);

		return this.sendReply(message, t('cmd.subtractLeaves.done'));
	}
}
