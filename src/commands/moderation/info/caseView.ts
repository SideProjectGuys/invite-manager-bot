import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { NumberResolver } from '../../../resolvers';
import { strikes } from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.caseView,
			aliases: ['case-view', 'viewCase', 'view-case'],
			args: [
				{
					name: 'caseNumber',
					resolver: NumberResolver,
					required: true
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
		{ guild, settings, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			title: `Case: ${caseNumber}`
		});

		const strike = await strikes.find({
			where: {
				id: caseNumber,
				guildId: guild.id
			}
		});

		if (strike) {
			embed.description = t('cmd.caseView.strike', {
				id: `${strike.id}`,
				amount: `**${strike.amount}**`,
				violation: `**${strike.type}**`,
				date: moment(strike.createdAt)
					.locale(settings.lang)
					.fromNow()
			});
		} else {
			embed.description = t('cmd.caseView.notFound');
		}

		this.client.sendReply(message, embed);
	}
}
