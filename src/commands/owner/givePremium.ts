import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import moment from 'moment';

import { User } from 'discord.js';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { premiumSubscriptions } from '../../sequelize';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'owner-give-premium',
			aliases: ['ownerGivePremium', 'ogp'],
			desc: 'Give premium',
			usage: '<prefix>owner-give-premium <amount> <user> <guild> <duration> <reason>',
			ownerOnly: true,
			hidden: true
		});
	}

	@using(
		resolve(
			'amount: Number, user: User, guildId: String, duration: String, reason: String'
		)
	)
	@using(
		expect('amount: Number, user: User, guildId: String, duration: String')
	)
	public async action(
		message: Message,
		[amount, user, guildId, duration, reason]: [
			number,
			User,
			string,
			string,
			string
		]
	): Promise<any> {
		this._logger.log(`(${message.author.username}): ${message.content}`);

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

		await premiumSubscriptions.create({
			id: null,
			amount: amount,
			validUntil: validUntil.toDate(),
			guildId,
			memberId: user.id
		});

		const embed = createEmbed(this.client);
		embed.setDescription(`Activated premium for ${premiumDuration.humanize()}`);
		embed.setAuthor(user.username, user.avatarURL());
		embed.addField('User', user.username);

		await sendReply(message, embed);

		let cmd = this.client.commands.resolve('ownerFlushPremium');
		cmd.action(message, [guildId]);
	}
}
