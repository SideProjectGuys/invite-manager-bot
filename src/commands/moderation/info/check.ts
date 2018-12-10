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
		[user]: [Member],
		flags: {},
		{ guild, settings, t }: Context
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
			.map(s =>
				t('cmd.check.strikes.entry', {
					id: `${s.id}`,
					amount: `**${s.amount}**`,
					violation: `**${s.violationType}**`,
					date: moment(s.createdAt)
						.locale(settings.lang)
						.fromNow()
				})
			)
			.join('\n');

		if (strikeText) {
			embed.fields.push({
				name: t('cmd.check.strikes.title'),
				value: strikeText
			});
		}

		let punishmentText = punishmentList
			.map(p =>
				t('cmd.check.punishments.entry', {
					punishment: `**${p.punishmentType}**`,
					amount: `**${p.amount}**`,
					date: moment(p.createdAt)
						.locale(settings.lang)
						.fromNow()
				})
			)
			.join('\n');

		if (punishmentText) {
			embed.fields.push({
				name: t('cmd.check.punishments.title'),
				value: punishmentText
			});
		}

		if (!punishmentText && !strikeText) {
			embed.description = t('cmd.check.noHistory');
		}

		this.client.sendReply(message, embed);
	}
}
