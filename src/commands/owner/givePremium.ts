import { Message, User } from 'eris';
import moment from 'moment';

import { IMClient } from '../../client';
import { LogAction } from '../../models/Log';
import { NumberResolver, StringResolver, UserResolver } from '../../resolvers';
import { OwnerCommand } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: OwnerCommand.givePremium,
			aliases: ['owner-give-premium', 'ogp'],
			// desc: 'Give premium',
			args: [
				{
					name: 'amount',
					resolver: NumberResolver,
					// description: 'The amount paid for premium.',
					required: true
				},
				{
					name: 'user',
					resolver: UserResolver,
					// description: 'The user that paid for premium.',
					required: true
				},
				{
					name: 'guildId',
					resolver: StringResolver,
					// description: 'The id of the guild that receives premium.',
					required: true
				},
				{
					name: 'duration',
					resolver: StringResolver,
					// description: 'The duration of the premium activation.',
					required: true
				}
			],
			strict: true,
			guildOnly: false,
			hidden: true
		});
	}

	public async action(
		message: Message,
		[amount, user, guildId, duration]: [number, User, string, string],
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

		await this.repo.premium.save({
			amount: amount,
			validUntil: validUntil.toDate(),
			guildId,
			memberId: user.id
		});

		this.client.logAction(context.guild, message, LogAction.owner, {
			type: 'give-premium',
			amount: amount,
			validUntil: validUntil.toDate(),
			guildId,
			memberId: user.id
		});

		const embed = this.createEmbed({
			description: `Activated premium for ${premiumDuration.humanize()}`,
			author: {
				name: user.username,
				icon_url: user.avatarURL
			}
		});
		embed.fields.push({ name: 'User', value: user.username });

		await this.sendReply(message, embed);

		let cmd = this.client.cmds.commands.find(
			c => c.name === OwnerCommand.flush
		);
		cmd.action(message, [guildId], context);
	}
}
