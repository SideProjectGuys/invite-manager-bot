import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { ranks, roles } from '../../../../sequelize';
import { CommandGroup, InvitesCommand } from '../../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: InvitesCommand.fixRanks,
			aliases: ['fix-ranks'],
			args: [],
			group: CommandGroup.Ranks,
			guildOnly: true,
			strict: true
		});
	}

	public async action(
		message: Message,
		args: [],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		const allRoles = await guild.getRESTRoles();
		const allRanks = await ranks.findAll({ where: { guildId: guild.id } });
		const oldRankIds = allRanks
			.filter(rank => !allRoles.some(r => r.id === rank.roleId))
			.map(r => r.id);
		await ranks.destroy({
			where: { guildId: guild.id, roleId: oldRankIds }
		});
		await roles.destroy({
			where: { guildId: guild.id, id: oldRankIds }
		});

		return this.sendReply(message, t('cmd.fixRanks.done'));
	}
}
