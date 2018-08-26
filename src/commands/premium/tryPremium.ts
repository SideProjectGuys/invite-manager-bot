import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../client';
import {
	createEmbed,
	prompt,
	PromptResult,
	sendReply
} from '../../functions/Messaging';
import { premiumSubscriptions } from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.tryPremium,
			aliases: ['try', 'try-premium'],
			desc: 'Try premium version.',
			group: CommandGroup.Premium,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ guild, settings, t }: Context
	): Promise<any> {
		const prefix = settings.prefix;

		const embed = createEmbed(this.client);

		const isPremium = this.client.cache.isPremium(guild.id);

		const trialDuration = moment.duration(1, 'week');
		const validUntil = moment().add(trialDuration);

		embed.title = t('CMD_TRYPREMIUM_TITLE');
		if (isPremium) {
			embed.description = t('CMD_TRYPREMIUM_CURRENTLY_ACTIVE');
		} else if (await this.guildHadTrial(guild.id)) {
			embed.description = t('CMD_TRYPREMIUM_ALREADY_USED', {
				prefix
			});
		} else {
			const promptEmbed = createEmbed(this.client);

			promptEmbed.description = t('CMD_TRYPREMIUM_DESCRIPTION', {
				duration: trialDuration.humanize()
			});

			await sendReply(this.client, message, promptEmbed);

			const [keyResult, keyValue] = await prompt(
				message,
				t('CMD_TRYPREMIUM_PROMPT')
			);
			if (keyResult === PromptResult.TIMEOUT) {
				return sendReply(this.client, message, t('PROMPT_TIMED_OUT'));
			}
			if (keyResult === PromptResult.FAILURE) {
				return sendReply(this.client, message, t('PROMPT_CANCELED'));
			}

			await premiumSubscriptions.create({
				id: null,
				amount: 0.0,
				validUntil: validUntil.toDate(),
				guildId: guild.id,
				memberId: message.author.id
			});
			this.client.cache.flushPremium(guild.id);

			embed.description = t('CMD_TRYPREMIUM_STARTED', {
				prefix
			});
		}

		return sendReply(this.client, message, embed);
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
