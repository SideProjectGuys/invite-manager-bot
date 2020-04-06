import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { CommandGroup, InvitesCommand } from '../../../types';
import { RanksCache } from '../../cache/RanksCache';

export default class extends IMCommand {
	@Cache() private ranksCache: RanksCache;

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

	public async action(message: Message, args: [], flags: {}, { guild, t }: CommandContext): Promise<any> {
		const allRoles = await guild.getRESTRoles();
		const allRanks = await this.ranksCache.get(guild.id);
		const oldRoleIds = allRanks.filter((rank) => !allRoles.some((r) => r.id === rank.roleId)).map((r) => r.roleId);

		for (const roleId of oldRoleIds) {
			await this.db.removeRank(guild.id, roleId);
		}

		this.ranksCache.flush(guild.id);

		return this.sendReply(message, t('cmd.fixRanks.done'));
	}
}
