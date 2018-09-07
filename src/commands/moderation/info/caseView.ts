import { Member, Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { NumberResolver, UserResolver } from '../../../resolvers';
import { punishments, strikes } from '../../../sequelize';
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
			strict: true,
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
			embed.description = t('cmd.caseView.strikes.entry', {
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
