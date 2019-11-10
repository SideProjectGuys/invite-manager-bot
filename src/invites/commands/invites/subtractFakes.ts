import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { CommandGroup, InvitesCommand } from '../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.subtractFakes,
			aliases: ['subtract-fakes', 'subfakes', 'sf'],
			group: CommandGroup.Invites,
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(message: Message, args: any[], flags: {}, { guild, t }: Context): Promise<any> {
		const jIds = await this.client.db.getMaxJoinIdsForGuild(guild.id);
		if (jIds.length === 0) {
			return this.sendReply(message, t('cmd.subtractFakes.none'));
		}

		await this.client.db.updateJoinInvalidatedReason(
			`CASE WHEN id IN (${jIds.join(',')}) THEN \`invalidatedReason\` ELSE 'fake' END`,
			guild.id
		);

		this.client.cache.invites.flush(guild.id);

		return this.sendReply(message, t('cmd.subtractFakes.done'));
	}
}
