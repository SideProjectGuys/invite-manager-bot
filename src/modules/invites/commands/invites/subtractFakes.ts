import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { CommandGroup, InvitesCommand } from '../../../../types';

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
		const maxJoins = await this.client.repo.join
			.createQueryBuilder()
			.select('MAX(id)', 'id')
			.groupBy('exactMatch')
			.addGroupBy('member')
			.where('guildId = :guildId', { guildId: guild.id })
			.getRawMany();

		if (maxJoins.length === 0) {
			return this.sendReply(message, t('cmd.subtractFakes.none'));
		}

		const jIds = maxJoins.map(j => j.id).join(',');
		await this.client.repo.join.update(
			{
				guildId: guild.id
			},
			{
				invalidatedReason: () => `CASE WHEN id IN (${jIds}) THEN invalidatedReason ELSE 'fake' END`
			}
		);

		this.client.cache.invites.flush(guild.id);

		return this.sendReply(message, t('cmd.subtractFakes.done'));
	}
}
