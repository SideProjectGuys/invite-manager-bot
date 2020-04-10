import { Message, Role } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { Service } from '../../../framework/decorators/Service';
import { LogAction } from '../../../framework/models/Log';
import { RoleResolver } from '../../../framework/resolvers';
import { CommandGroup } from '../../../types';
import { RanksCache } from '../../cache/RanksCache';
import { RanksService } from '../../services/Ranks';

export default class extends IMCommand {
	@Service() private ranks: RanksService;
	@Cache() private ranksCache: RanksCache;

	public constructor(client: IMClient) {
		super(client, {
			name: 'removeRank',
			aliases: ['remove-rank'],
			args: [
				{
					name: 'rank',
					resolver: RoleResolver,
					required: true
				}
			],
			group: CommandGroup.Ranks,
			guildOnly: true,
			defaultAdminOnly: true,
			extraExamples: ['!removeRank @Role', '!removeRank "Role with space"']
		});
	}

	public async action(message: Message, [role]: [Role], flags: {}, { guild, t }: CommandContext): Promise<any> {
		const ranks = await this.ranksCache.get(guild.id);
		const rank = ranks.find((r) => r.roleId === role.id);

		if (rank) {
			await this.ranks.removeRank(guild.id, rank.roleId);

			await this.client.logAction(guild, message, LogAction.removeRank, {
				roleId: role.id
			});

			this.ranksCache.flush(guild.id);

			return this.sendReply(message, t('cmd.removeRank.done', { role: `<@&${role.id}>` }));
		} else {
			return this.sendReply(message, t('cmd.removeRank.rankNotFound', { role: `<@&${role.id}>` }));
		}
	}
}
