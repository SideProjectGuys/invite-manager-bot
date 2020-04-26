import { Message } from 'eris';

import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { Service } from '../../../framework/decorators/Service';
import { IMModule } from '../../../framework/Module';
import { RanksCache } from '../../cache/RanksCache';
import { RanksService } from '../../services/Ranks';

export default class extends IMCommand {
	@Service() private ranks: RanksService;
	@Cache() private ranksCache: RanksCache;

	public constructor(module: IMModule) {
		super(module, {
			name: 'fixRanks',
			aliases: ['fix-ranks'],
			args: [],
			group: 'Ranks',
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(message: Message, args: [], flags: {}, { guild, t }: CommandContext): Promise<any> {
		const allRoles = await guild.getRESTRoles();
		const allRanks = await this.ranksCache.get(guild.id);
		const oldRoleIds = allRanks.filter((rank) => !allRoles.some((r) => r.id === rank.roleId)).map((r) => r.roleId);

		for (const roleId of oldRoleIds) {
			await this.ranks.removeRank(guild.id, roleId);
		}

		this.ranksCache.flush(guild.id);

		return this.sendReply(message, t('cmd.fixRanks.done'));
	}
}
