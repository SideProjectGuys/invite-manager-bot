import { Message, User } from 'eris';
import moment from 'moment';

import { IMClient } from '../../client';
import { NumberResolver, StringResolver, UserResolver } from '../../resolvers';
import { LogAction, premiumSubscriptions } from '../../sequelize';
import { OwnerCommand } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: OwnerCommand.givePremium,
			aliases: ['owner-give-premium', 'ogp'],
			args: [
				{
					name: 'amount',
					resolver: NumberResolver,
					required: true
				},
				{
					name: 'user',
					resolver: UserResolver,
					required: true
				},
				{
					name: 'duration',
					resolver: StringResolver,
					required: true
				},
				{
					name: 'maxGuilds',
					resolver: NumberResolver
				}
			],
			strict: true,
			guildOnly: false,
			hidden: true
		});
	}

	public async action(
		message: Message,
		[amount, user, duration, numGuilds]: [number, User, string, number],
		context: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(context.guild.id) === -1) {
			return;
		}

		let days = 1;
		if (duration) {
			const d = parseInt(duration, 10);

			if (duration.indexOf('d') >= 0) {
				days = d;
			} else if (duration.indexOf('w') >= 0) {
				days = d * 7;
			} else if (duration.indexOf('m') >= 0) {
				days = d * 30;
			} else if (duration.indexOf('y') >= 0) {
				days = d * 365;
			}
		}

		const premiumDuration = moment.duration(days, 'day');
		const validUntil = moment().add(premiumDuration);
		const maxGuilds = numGuilds ? numGuilds : 5;

		const sub = await premiumSubscriptions.create({
			id: null,
			amount,
			maxGuilds,
			validUntil: validUntil.toDate(),
			memberId: user.id
		});

		this.client.logAction(context.guild, message, LogAction.owner, {
			type: 'give-premium',
			amount,
			maxGuilds,
			validUntil: validUntil.toDate(),
			memberId: user.id
		});

		const embed = this.client.createEmbed({
			description: `Activated premium for ${premiumDuration.humanize()}`,
			author: {
				name: user.username,
				icon_url: user.avatarURL
			}
		});
		embed.fields.push({ name: 'User', value: user.username });

		await this.client.sendReply(message, embed);
	}
}
