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
import {
	createEmbed,
	prompt,
	PromptResult,
	sendReply
} from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import { premiumSubscriptions } from '../../sequelize';
import { SettingsCache } from '../../storage/SettingsCache';
import { BotCommand, CommandGroup, RP } from '../../types';

const { localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'try-premium',
			aliases: ['try', 'trypremium'],
			desc: 'Try premium version.',
			usage: '<prefix>try-premium',
			group: CommandGroup.Premium,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.tryPremium))
	@using(localize)
	public async action(message: Message, [rp]: [RP]): Promise<any> {
		this._logger.log(
			`${message.guild ? message.guild.name : 'DM'} (${
				message.author.username
			}): ${message.content}`
		);

		const prefix = (await SettingsCache.get(message.guild.id)).prefix;

		const embed = createEmbed(this.client);

		const isPremium = await SettingsCache.isPremium(message.guild.id);

		const trialDuration = moment.duration(1, 'week');
		const validUntil = moment().add(trialDuration);

		embed.setTitle('InviteManager Premium');
		if (isPremium) {
			embed.setDescription(rp.CMD_TRYPREMIUM_CURRENTLY_ACTIVE());
		} else if (await this.guildHadTrial(message.guild.id)) {
			embed.setDescription(
				rp.CMD_TRYPREMIUM_ALREADY_USED({
					prefix
				})
			);
		} else {
			const promptEmbed = createEmbed(this.client);

			promptEmbed.setDescription(
				rp.CMD_TRYPREMIUM_DESCRIPTION({
					duration: trialDuration.humanize()
				})
			);

			await sendReply(message, promptEmbed);

			const [keyResult, keyValue] = await prompt(
				message,
				rp.CMD_TRYPREMIUM_PROMPT()
			);
			if (keyResult === PromptResult.TIMEOUT) {
				return sendReply(message, rp.PROMPT_TIMED_OUT());
			}
			if (keyResult === PromptResult.FAILURE) {
				return sendReply(message, rp.PROMPT_CANCELED());
			}

			await premiumSubscriptions.create({
				id: null,
				amount: 0.0,
				validUntil: validUntil.toDate(),
				guildId: message.guild.id,
				memberId: message.author.id
			});
			SettingsCache.flushPremium(message.guild.id);

			embed.setDescription(
				rp.CMD_TRYPREMIUM_STARTED({
					prefix
				})
			);
		}

		return sendReply(message, embed);
	}

	private async guildHadTrial(guildID: string): Promise<boolean> {
		const subs = await premiumSubscriptions.findAll({
			where: {
				guildId: guildID
			},
			raw: true
		});

		return subs.length > 0;
	}
}
