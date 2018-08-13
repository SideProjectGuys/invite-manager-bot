import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import moment from 'moment';

import { Guild, User } from 'discord.js';

import { IMClient } from '../../client';
import { createEmbed, sendEmbed } from '../../functions/Messaging';
import { premiumSubscriptions } from '../../sequelize';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'ownerGivePremium',
			aliases: ['owner-give-premium', 'ogp'],
			desc: 'Give premium',
			usage: '<prefix>ogp <guildID>',
			ownerOnly: true,
			hidden: true
		});
	}

	@using(resolve('amount: Number, user: User, guildId: String, duration: String, reason: String'))
	@using(expect('amount: Number, user: User, guildId: String, duration: String'))
	public async action(
		message: Message,
		[amount, user, guild, duration, reason]: [number, User, Guild, string, string]
	): Promise<any> {
		this._logger.log(`(${message.author.username}): ${message.content}`);

		const premiumDuration = moment.duration(duration);
		const validUntil = moment().add(premiumDuration);

		await premiumSubscriptions.create({
			id: null,
			amount: amount,
			validUntil: validUntil.toDate(),
			guildId: guild.id,
			memberId: user.id
		});

		const embed = createEmbed(this.client);
		embed.setDescription(`Activated premium for ${premiumDuration.humanize()}`);
		embed.setThumbnail(guild.icon);
		embed.setAuthor(user.username, user.avatarURL());
		embed.addField('User', user.username);
		embed.addField('Guild', guild.name);

		await sendEmbed(message.channel, embed, message.author);

		let cmd = this.client.commands.resolve('ownerFlushPremium');
		cmd.action(message, [guild]);
	}
}
