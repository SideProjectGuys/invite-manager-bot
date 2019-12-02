import axios from 'axios';
import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { BotCommand, BotType, CommandGroup, GuildPermission } from '../../../types';
import { EnumResolver } from '../../resolvers';
import { Command, Context } from '../Command';

enum Action {
	Check = 'Check',
	Activate = 'Activate',
	Deactivate = 'Deactivate'
}

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.premium,
			aliases: ['patreon', 'donate'],
			args: [
				{
					name: 'action',
					resolver: new EnumResolver(client, Object.values(Action))
				}
			],
			group: CommandGroup.Premium,
			guildOnly: false,
			defaultAdminOnly: true,
			extraExamples: ['!premium check', '!premium activate', '!premium deactivate']
		});
	}

	public async action(
		message: Message,
		[action]: [Action],
		flags: {},
		{ guild, t, settings, isPremium }: Context
	): Promise<any> {
		// TODO: Create list of premium features (also useful for FAQ)
		const lang = settings.lang;
		const guildId = guild ? guild.id : undefined;

		const embed = this.createEmbed();

		const sub = await this.client.db.getActivePremiumSubscriptionForMember(message.author.id);
		const guildSubs = sub ? await this.client.db.getPremiumSubscriptionGuildsForSubscription(sub.id) : [];

		if (!action) {
			if (!sub) {
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
			} else {
				embed.title = t('cmd.premium.premium.title');

				const date = moment(sub.validUntil)
					.locale(lang)
					.fromNow(true);

				let guildList = '';
				guildSubs.forEach(guildSub => {
					const guildName = guildSub.guildName;
					guildList += `- **${guildName}**` + (guildSub.guildId === guildId ? ' *(This server)*' : '') + '\n';
				});
				if (guildId) {
					if (guildSubs.some(s => s.guildId === guildId)) {
						guildList +=
							'\n' +
							t('cmd.premium.premium.deactivate', {
								cmd: `\`${settings.prefix}premium deactivate\``
							});
					} else {
						guildList +=
							'\n' +
							t('cmd.premium.premium.activate', {
								cmd: `\`${settings.prefix}premium activate\``
							});
					}
				}

				const limit = `**${guildSubs.length}/${sub.maxGuilds}**`;

				embed.description =
					t('cmd.premium.premium.text', {
						date,
						limit,
						guildList,
						link: 'https://docs.invitemanager.co/bot/premium/features'
					}) + '\n';
			}
		} else {
			if (action === Action.Activate) {
				embed.title = t('cmd.premium.activate.title');

				if (this.client.type === BotType.custom) {
					embed.description = t('cmd.premium.activate.customBot');
				} else if (!guildId) {
					embed.description = t('cmd.premium.activate.noGuild');
				} else if (isPremium) {
					embed.description = t('cmd.premium.activate.currentlyActive');
				} else if (!sub) {
					embed.description = t('cmd.premium.activate.noSubscription', {
						cmd: '`' + settings.prefix + 'premium`'
					});
				} else {
					if (guildSubs.length >= sub.maxGuilds) {
						embed.description = t('cmd.premium.activate.maxGuilds');
					} else {
						await this.client.db.savePremiumSubscriptionGuild({
							subscriptionId: sub.id,
							guildId
						});

						this.client.cache.premium.flush(guildId);

						embed.description = t('cmd.premium.activate.done');
					}
				}
			} else if (action === Action.Deactivate) {
				embed.title = t('cmd.premium.deactivate.title');

				if (this.client.type === BotType.custom) {
					embed.description = t('cmd.premium.deactivate.customBot');
				} else if (!guildId) {
					embed.description = t('cmd.premium.deactivate.noGuild');
				} else if (!message.member.permission.has(GuildPermission.ADMINISTRATOR)) {
					embed.description = t('cmd.premium.deactivate.adminOnly');
				} else if (!isPremium) {
					embed.description = t('cmd.premium.deactivate.noSubscription');
				} else {
					await this.client.db.removePremiumSubscriptionGuild(guildId, sub.id);

					this.client.cache.premium.flush(guildId);

					embed.description = t('cmd.premium.deactivate.done');
				}
			} else if (action === Action.Check) {
				embed.title = t('cmd.premium.check.title');

				const userId = message.author.id;
				const res = await axios
					.get(`https://api.invitemanager.gg/patreon/check/?userId=${userId}`, {
						auth: this.client.config.bot.apiAuth
					})
					.catch(() => undefined);

				if (!res) {
					embed.description = t('cmd.premium.check.notFound');
				} else if (res.data.last_charge_status !== 'Paid') {
					embed.description = t('cmd.premium.check.declined');
				} else if (res.data.patron_status !== 'active_patron') {
					embed.description = t('cmd.premium.check.paused', {
						since: res.data.last_charge_date
					});
				} else {
					const day = moment(res.data.last_charge_date).date();
					const validUntil = moment()
						.add(1, 'month')
						.date(day)
						.add(1, 'day');

					if (sub) {
						sub.validUntil = validUntil.toDate();
						await this.client.db.savePremiumSubscription(sub);
					} else {
						await this.client.db.savePremiumSubscription({
							memberId: userId,
							validUntil: validUntil.toDate(),
							amount: res.data.currently_entitled_amount_cents / 100,
							maxGuilds: 5,
							isFreeTier: false,
							reason: '!premium check'
						});
					}

					embed.description = t('cmd.premium.check.done', {
						valid: validUntil.locale(lang).calendar(),
						cmd: '`' + settings.prefix + 'premium`'
					});
				}
			}
		}

		return this.sendReply(message, embed);
	}
}
