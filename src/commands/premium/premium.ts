import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import moment from 'moment';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import { premiumSubscriptions, sequelize } from '../../sequelize';
import { SettingsCache } from '../../storage/SettingsCache';
import { BotCommand, CommandGroup, RP } from '../../types';

const { localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'premium',
			aliases: ['patreon', 'donate'],
			desc: 'Info about premium version.',
			usage: '<prefix>premium',
			group: CommandGroup.Premium,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.premium))
	@using(localize)
	public async action(message: Message, [rp]: [RP]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		// TODO: Create list of premium features (also useful for FAQ)
		const lang = (await SettingsCache.get(message.guild.id)).lang;

		const embed = createEmbed(this.client);

		const isPremium = await SettingsCache.isPremium(message.guild.id);

		if (!isPremium) {
			embed.setTitle(rp.CMD_PREMIUM_NO_PREMIUM_TITLE());
			embed.setDescription(rp.CMD_PREMIUM_NO_PREMIUM_DESCRIPTION());

			embed.addField(
				rp.CMD_PREMIUM_FEATURE_EMBEDS_TITLE(),
				rp.CMD_PREMIUM_FEATURE_EMBEDS_DESCRIPTION()
			);

			embed.addField(
				rp.CMD_PREMIUM_FEATURE_EXPORT_TITLE(),
				rp.CMD_PREMIUM_FEATURE_EXPORT_DESCRIPTION()
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

			embed.setTitle(rp.CMD_PREMIUM_PREMIUM_TITLE());

			let description = '';
			if (sub) {
				const date = moment(sub.validUntil)
					.locale(lang)
					.fromNow(true);
				description = rp.CMD_PREMIUM_PREMIUM_DESCRIPTION({
					date
				});
			} else {
				description += rp.CMD_PREMIUM_PREMIUM_NOT_FOUND();
			}
			embed.setDescription(description);
		}

		return sendReply(message, embed);
	}
}
