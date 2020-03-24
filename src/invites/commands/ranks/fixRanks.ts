import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { CommandGroup, InvitesCommand } from '../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.fixRanks,
			aliases: ['fix-ranks'],
			args: [],
			group: CommandGroup.Ranks,
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(message: Message, args: [], flags: {}, { guild, t }: Context): Promise<any> {
		const allRoles = await guild.getRESTRoles();
		const allRanks = await this.client.cache.ranks.get(guild.id);
		const oldRoleIds = allRanks.filter((rank) => !allRoles.some((r) => r.id === rank.roleId)).map((r) => r.roleId);

		for (const roleId of oldRoleIds) {
			await this.client.db.removeRank(guild.id, roleId);
		}

		this.client.cache.ranks.flush(guild.id);

		return this.sendReply(message, t('cmd.fixRanks.done'));
	}
}
