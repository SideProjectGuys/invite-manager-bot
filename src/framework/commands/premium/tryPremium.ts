import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { CommandGroup, PromptResult } from '../../../types';
import { PremiumCache } from '../../cache/Premium';
import { Cache } from '../../decorators/Cache';
import { CommandContext, IMCommand } from '../Command';

export default class extends IMCommand {
	@Cache() private premiumCache: PremiumCache;

	public constructor(client: IMClient) {
		super(client, {
			name: 'tryPremium',
			aliases: ['try', 'try-premium'],
			group: CommandGroup.Premium,
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		flags: {},
		{ guild, settings, t, isPremium }: CommandContext
	): Promise<any> {
		const prefix = settings.prefix;

		const embed = this.createEmbed();

		const trialDuration = moment.duration(1, 'week');
		const validUntil = moment().add(trialDuration);

		embed.title = t('cmd.tryPremium.title');
		if (isPremium) {
			embed.description = t('cmd.tryPremium.currentlyActive');
		} else if (await this.memberHadTrial(message.author.id)) {
			embed.description = t('cmd.tryPremium.alreadyUsed', {
				prefix
			});
		} else {
			const promptEmbed = this.createEmbed();

			promptEmbed.description = t('cmd.tryPremium.text', {
				duration: trialDuration.humanize()
			});

			await this.sendReply(message, promptEmbed);

			const [keyResult] = await this.msg.prompt(message, t('cmd.tryPremium.prompt'));
			if (keyResult === PromptResult.TIMEOUT) {
				return this.sendReply(message, t('prompt.timedOut'));
			}
			if (keyResult === PromptResult.FAILURE) {
				return this.sendReply(message, t('prompt.canceled'));
			}

			await this.db.savePremiumSubscription({
				amount: 0,
				maxGuilds: 1,
				isFreeTier: true,
				isPatreon: false,
				isStaff: false,
				validUntil: validUntil.toDate(),
				memberId: message.author.id,
				reason: ''
			});
			await this.db.savePremiumSubscriptionGuild({
				memberId: message.author.id,
				guildId: guild.id
			});

			this.premiumCache.flush(guild.id);

			embed.description = t('cmd.tryPremium.started', {
				prefix
			});
		}

		return this.sendReply(message, embed);
	}

	private async memberHadTrial(memberId: string): Promise<boolean> {
		const sub = await this.db.getPremiumSubscriptionsForMember(memberId, false, true);
		return sub && sub.length > 0;
	}
}
