import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { UserResolver } from '../../../framework/resolvers';
import { BasicUser } from '../../../types';
import { PunishmentService } from '../../services/PunishmentService';
import { StrikeService } from '../../services/StrikeService';

export default class extends IMCommand {
	@Service() private strikes: StrikeService;
	@Service() private punishments: PunishmentService;

	public constructor(client: IMClient) {
		super(client, {
			name: 'check',
			aliases: ['history'],
			args: [
				{
					name: 'user',
					resolver: UserResolver,
					required: true
				}
			],
			group: 'Moderation',
			defaultAdminOnly: true,
			guildOnly: true,
			extraExamples: ['!check @User', '!check "User with space"']
		});
	}

	public async action(
		message: Message,
		[user]: [BasicUser],
		flags: {},
		{ guild, settings, t }: CommandContext
	): Promise<any> {
		const embed = this.createEmbed({
			title: user.username
		});

		const strikeList = await this.strikes.getStrikesForMember(guild.id, user.id);
		const strikeTotal = strikeList.reduce((acc, s) => acc + s.amount, 0);

		embed.fields.push({
			name: t('cmd.check.strikes.total'),
			value: t('cmd.check.strikes.totalText', {
				amount: `**${strikeList.length}**`,
				total: `**${strikeTotal}**`
			}),
			inline: false
		});

		const punishmentList = await this.punishments.getPunishmentsForMember(guild.id, user.id);

		embed.fields.push({
			name: t('cmd.check.punishments.total'),
			value: t('cmd.check.punishments.totalText', {
				amount: `**${punishmentList.length}**`
			}),
			inline: false
		});

		const strikeText = strikeList
			.map((s) =>
				t('cmd.check.strikes.entry', {
					id: `**${s.id}**`,
					amount: `**${s.amount}**`,
					violation: `**${s.type}**`,
					date: moment(s.createdAt).locale(settings.lang).fromNow()
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
			.map((p) =>
				t('cmd.check.punishments.entry', {
					id: `**${p.id}**`,
					punishment: `**${p.type}**`,
					amount: `**${p.amount}**`,
					date: moment(p.createdAt).locale(settings.lang).fromNow()
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

		await this.sendReply(message, embed);
	}
}
