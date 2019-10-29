import { Message, Role } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { RoleResolver } from '../../../framework/resolvers';
import { LogAction } from '../../../models/Log';
import { CommandGroup, InvitesCommand } from '../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.removeRank,
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

	public async action(message: Message, [role]: [Role], flags: {}, { guild, t }: Context): Promise<any> {
		const rank = await this.client.repo.rank.findOne({
			where: {
				guildId: role.guild.id,
				roleId: role.id
			}
		});

		if (rank) {
			await this.client.repo.rank.delete({ roleId: rank.roleId });

			await this.client.logAction(guild, message, LogAction.removeRank, {
				roleId: role.id
			});

			this.client.cache.ranks.flush(guild.id);

			return this.sendReply(message, t('cmd.removeRank.done', { role: `<@&${role.id}>` }));
		} else {
			return this.sendReply(message, t('cmd.removeRank.rankNotFound', { role: `<@&${role.id}>` }));
		}
	}
}
