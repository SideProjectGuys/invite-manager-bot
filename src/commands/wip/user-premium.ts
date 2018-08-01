import { Command, Logger, logger, Message } from '@yamdbf/core';

import { IMClient } from '../../client';
import { premiumSubscriptions, sequelize } from '../../sequelize';
import { SettingsCache } from '../../utils/SettingsCache';
import { CommandGroup, createEmbed, sendEmbed } from '../../utils/util';

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'premium',
			aliases: ['patreon', 'donate'],
			desc: 'Info about premium version.',
			usage: '<prefix>premium',
			group: CommandGroup.Other,
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const ONE_SECOND = 1000;
		const ONE_MINUTE = 60 * ONE_SECOND;
		const ONE_HOUR = 60 * ONE_MINUTE;
		const ONE_DAY = 24 * ONE_HOUR;
		const ONE_WEEK = 7 * ONE_DAY;
		const ONE_MONTH = 4 * ONE_WEEK;
		const todayTimestamp = new Date().getTime();

		// TODO: Create list of premium features (also useful for FAQ)

		const embed = createEmbed(this.client);

		const isPremium = await SettingsCache.isPremium(message.guild.id);

		if (!isPremium) {
			embed.setTitle('You currently do not have a premium subscription');

			let description = '';
			description += 'By subscribing to a premium tier you help the development of the bot';
			description += ' and also get some additional features.';

			embed.setDescription(description);

			embed.addField(
				'Premium Feature: Embeds in join messages',
				'You can use an embed in your join and leave messages which look a lot better.'
			);

			embed.addField(
				'Premium Feature: History export',
				'You can export all the joins and leaves that happened on your server since you invited our bot.'
			);
		} else {

			const sub = await premiumSubscriptions.findOne({
				where: {
					guildId: message.guild.id,
					validUntil: {
						[sequelize.Op.gte]: new Date()
					}
				},
				raw: true
			});

			embed.setTitle('InviteManager Premium');

			let description = '';
			if (sub) {
				description += `Your subscription is valid until ${sub.validUntil}`;
			} else {
				description += `Could not find subscription info.`;
			}
			embed.setDescription(description);
		}

		sendEmbed(message.channel, embed, message.author);
	}
}
