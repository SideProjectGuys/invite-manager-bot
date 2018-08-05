import { Command, Logger, logger, Message } from '@yamdbf/core';
import moment from 'moment';

import { IMClient } from '../../client';
import { premiumSubscriptions, sequelize } from '../../sequelize';
import { SettingsCache } from '../../utils/SettingsCache';
import {
	CommandGroup,
	createEmbed,
	prompt,
	PromptResult,
	sendEmbed
} from '../../utils/util';

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'try-premium',
			aliases: ['try', 'trypremium'],
			desc: 'Try premium version.',
			usage: '<prefix>try-premium',
			group: CommandGroup.Premium,
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			guildOnly: true
		});
	}

	public async action(message: Message, args: string[]): Promise<any> {
		this._logger.log(
			`${message.guild ? message.guild.name : 'DM'} (${
				message.author.username
			}): ${message.content}`
		);

		const embed = createEmbed(this.client);

		const isPremium = await SettingsCache.isPremium(message.guild.id);

		const trialDuration = moment.duration(1, 'week');
		const validUntil = moment().add(trialDuration);

		embed.setTitle('InviteManager Premium');
		if (isPremium) {
			embed.setDescription(
				'You currently have an active premium subscription!'
			);
		} else if (await this.guildHadTrial(message.guild.id)) {
			embed.setDescription(
				'You have already tried out our premium feature. If you liked it, ' +
					'please consider supporting us. You can find more information using the `!premium` command.'
			);
		} else {
			const promptEmbed = createEmbed(this.client);

			promptEmbed.setDescription(
				'You can try out our premium features for ' +
					trialDuration.humanize() +
					'. You can only do this once. Would you like to test it now?'
			);

			await sendEmbed(message.channel, promptEmbed, message.author);

			const [keyResult, keyValue] = await prompt(
				message,
				'Please reply with **yes** or **no**.'
			);
			if (keyResult === PromptResult.TIMEOUT) {
				return message.channel.send('Command timed out, aborting...');
			}
			if (keyResult === PromptResult.FAILURE) {
				return message.channel.send('Okay, aborting.');
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
				'You successfully started your trial! Use `!premium` to check how much time you have left'
			);
		}

		sendEmbed(message.channel, embed, message.author);
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
