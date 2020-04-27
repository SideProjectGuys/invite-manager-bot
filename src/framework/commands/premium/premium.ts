import { Message } from 'eris';
import moment from 'moment';

import { BotType, GuildPermission } from '../../../types';
import { PremiumCache } from '../../cache/Premium';
import { Cache } from '../../decorators/Cache';
import { IMModule } from '../../Module';
import { BooleanResolver, StringResolver } from '../../resolvers';
import { CommandContext, IMCommand } from '../Command';

export default class extends IMCommand {
	@Cache() private premiumCache: PremiumCache;

	public constructor(module: IMModule) {
		super(module, {
			name: 'premium',
			aliases: [],
			args: [
				{
					name: 'enabled',
					resolver: BooleanResolver,
					required: false
				},
				{
					name: 'guildId',
					resolver: StringResolver,
					required: false
				}
			],
			group: 'Premium',
			guildOnly: false,
			defaultAdminOnly: false,
			extraExamples: ['!premium on', '!premium off 409846837571485698']
		});
	}

	public async action(
		message: Message,
		[enabled, _guildId]: [boolean, string],
		flags: {},
		{ guild, t, settings, isPremium }: CommandContext
	): Promise<any> {
		const lang = settings.lang;
		const guildId = _guildId || (guild ? guild.id : undefined);
		const memberId = message.author.id;

		const subs = await this.db.getPremiumSubscriptionsForMember(memberId, true);
		const guildSubs = subs ? await this.db.getPremiumSubscriptionGuildsForMember(memberId) : [];

		const embed = this.createEmbed();

		if (!subs || subs.length === 0) {
			embed.title = t('cmd.premium.noPremium.title');
			embed.description = t('cmd.premium.noPremium.text');

			embed.fields.push({
				name: t('cmd.premium.feature.servers.title'),
				value: t('cmd.premium.feature.servers.text')
			});

			embed.fields.push({
				name: t('cmd.premium.feature.embeds.title'),
				value: t('cmd.premium.feature.embeds.text', {
					link: 'https://docs.invitemanager.co/bot/custom-messages/join-message-examples'
				})
			});

			embed.fields.push({
				name: t('cmd.premium.feature.export.title'),
				value: t('cmd.premium.feature.export.text')
			});

			embed.fields.push({
				name: t('cmd.premium.feature.patreon.title'),
				value: t('cmd.premium.feature.patreon.text', {
					cmd: '`' + settings.prefix + 'premium check`'
				})
			});

			return this.sendReply(message, embed);
		}

		if (typeof enabled === 'undefined') {
			embed.title = t('cmd.premium.premium.title');

			const maxDate = subs.reduce((acc, sub) => Math.max(acc, moment(sub.validUntil).unix()), 0);
			const date = moment.unix(maxDate).locale(lang).fromNow(true);

			let guildList = '';
			guildSubs.forEach((guildSub) => {
				const guildName = guildSub.guildName;
				guildList += `- **${guildName}**\n`;
			});

			const limit = `**${guildSubs.length}/${subs.reduce((acc, sub) => Math.max(acc, sub.maxGuilds), 0)}**`;

			embed.description =
				t('cmd.premium.premium.text', {
					date,
					limit,
					guildList,
					link: 'https://docs.invitemanager.co/bot/premium/features'
				}) + '\n';

			return this.sendReply(message, embed);
		}

		if (enabled) {
			embed.title = t('cmd.premium.activate.title');

			if (this.client.type === BotType.custom) {
				embed.description = t('cmd.premium.activate.customBot');
			} else if (!guild) {
				embed.description = t('cmd.premium.activate.noGuild');
			} else if (!message.member.permission.has(GuildPermission.MANAGE_GUILD)) {
				embed.description = t('cmd.premium.activate.permissions');
			} else if (isPremium) {
				embed.description = t('cmd.premium.activate.currentlyActive');
			} else if (!subs) {
				embed.description = t('cmd.premium.activate.noSubscription', {
					cmd: '`' + settings.prefix + 'premium`'
				});
			} else {
				const maxGuilds = subs.reduce((acc, sub) => Math.max(acc, sub.maxGuilds), 0);
				if (guildSubs.length >= maxGuilds) {
					embed.description = t('cmd.premium.activate.maxGuilds');
				} else {
					await this.db.savePremiumSubscriptionGuild({
						memberId,
						guildId
					});

					this.premiumCache.flush(guildId);

					embed.description = t('cmd.premium.activate.done');
				}
			}
		} else {
			embed.title = t('cmd.premium.deactivate.title');

			if (this.client.type === BotType.custom) {
				embed.description = t('cmd.premium.deactivate.customBot');
			} else if (!guildId) {
				embed.description = t('cmd.premium.deactivate.noGuild');
			} else if (!guildSubs.some((sub) => sub.guildId === guildId)) {
				embed.description = t('cmd.premium.deactivate.notActive');
			} else {
				await this.db.removePremiumSubscriptionGuild(memberId, guildId);

				this.premiumCache.flush(guildId);

				embed.description = t('cmd.premium.deactivate.done');
			}
		}

		return this.sendReply(message, embed);
	}
}
