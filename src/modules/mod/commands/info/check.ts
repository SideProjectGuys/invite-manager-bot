import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { UserResolver } from '../../../../framework/resolvers';
import { punishments, strikes } from '../../../../sequelize';
import { BasicUser, CommandGroup, ModerationCommand } from '../../../../types';

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
		[user]: [BasicUser],
		flags: {},
		{ guild, settings, t }: Context
	): Promise<any> {
		const embed = this.createEmbed({
			title: user.username
		});

		const strikeList = await strikes.findAll({
			where: {
				guildId: guild.id,
				memberId: user.id
			}
		});

		const strikeTotal = strikeList.reduce((acc, s) => acc + s.amount, 0);

		embed.fields.push({
			name: t('cmd.check.strikes.total'),
			value: t('cmd.check.strikes.totalText', {
				amount: `**${strikeList.length}**`,
				total: `**${strikeTotal}**`
			}),
			inline: false
		});

		const punishmentList = await punishments.findAll({
			where: {
				guildId: guild.id,
				memberId: user.id
			}
		});

		embed.fields.push({
			name: t('cmd.check.punishments.total'),
			value: t('cmd.check.punishments.totalText', {
				amount: `**${punishmentList.length}**`
			}),
			inline: false
		});

		const strikeText = strikeList
			.map(s =>
				t('cmd.check.strikes.entry', {
					id: `**${s.id}**`,
					amount: `**${s.amount}**`,
					violation: `**${s.type}**`,
					date: moment(s.createdAt)
						.locale(settings.lang)
						.fromNow()
				})
			)
			.join('\n');

		if (strikeText) {
			embed.fields.push({
				name: t('cmd.check.strikes.title'),
				value: strikeText.substr(0, 1020)
			});
		}

		const punishmentText = punishmentList
			.map(p =>
				t('cmd.check.punishments.entry', {
					punishment: `**${p.type}**`,
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
				value: punishmentText.substr(0, 1020)
			});
		}

		if (!punishmentText && !strikeText) {
			embed.description = t('cmd.check.noHistory');
		}

		this.sendReply(message, embed);
	}
}
