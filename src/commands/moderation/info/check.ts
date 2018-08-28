import { Member, Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { UserResolver } from '../../../resolvers';
import { punishments, strikes } from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.check,
			aliases: ['history'],
			args: [
				{
					name: 'user',
					resolver: UserResolver,
					description: 'User to check',
					required: true
				}
			],
			desc: 'Check history of a user',
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[user]: [Member],
		{ guild }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			title: user.username
		});

		let punishmentList = await punishments.findAll({
			where: {
				guildId: guild.id,
				memberId: user.id
			}
		});

		let strikeList = await strikes.findAll({
			where: {
				guildId: guild.id,
				memberId: user.id
			}
		});

		let strikeText = strikeList
			.map(
				s =>
					`${s.amount} for ${s.violationType} ${moment(s.createdAt).fromNow()}`
			)
			.join('\n');

		if (strikeText) {
			embed.fields.push({
				name: 'Strikes',
				value: strikeText
			});
		}

		let punishmentText = punishmentList
			.map(
				p =>
					`${p.punishmentType} because he had ${p.amount} strikes ${moment(
						p.createdAt
					).fromNow()}`
			)
			.join('\n');

		if (punishmentText) {
			embed.fields.push({
				name: 'Punishments',
				value: punishmentText
			});
		}

		if (!punishmentText && !strikeText) {
			embed.description = `User does not have any history.`;
		}

		this.client.sendReply(message, embed);
	}
}
