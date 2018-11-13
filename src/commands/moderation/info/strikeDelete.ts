import { Message } from 'eris';
import moment from 'moment';

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
		{ guild, settings, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			title: `Case: ${caseNumber}`
		});

		let strike = await strikes.find({
			where: {
				id: caseNumber,
				guildId: guild.id
			}
		});

		if (strike) {
			embed.description = t('cmd.check.strikes.entry', {
				id: `${strike.id}`,
				amount: `**${strike.amount}**`,
				violation: `**${strike.violationType}**`,
				date: moment(strike.createdAt)
					.locale(settings.lang)
					.fromNow()
			});
		} else {
			embed.description = `Could not find a case`;
		}

		this.client.sendReply(message, embed);
	}
}
