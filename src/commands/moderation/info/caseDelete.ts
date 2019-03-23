import { Message } from 'eris';

import { IMClient } from '../../../client';
import { NumberResolver, StringResolver } from '../../../resolvers';
import { strikes } from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.caseDelete,
			aliases: ['case-delete', 'deleteCase', 'delete-case'],
			args: [
				{
					name: 'caseNumber',
					resolver: NumberResolver,
					required: true
				},
				{
					name: 'reason',
					resolver: StringResolver,
					rest: true
				}
			],
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[caseNumber]: [number],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.createEmbed({
			title: t('cmd.caseDelete.title', {
				number: caseNumber
			})
		});

		const strike = await strikes.find({
			where: {
				id: caseNumber,
				guildId: guild.id
			}
		});

		if (strike) {
			await strike.destroy();
			embed.description = t('cmd.caseDelete.done', {
				id: `${strike.id}`
			});
		} else {
			embed.description = t('cmd.caseDelete.notFound');
		}

		this.sendReply(message, embed);
	}
}
