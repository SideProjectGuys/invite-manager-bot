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
			defaultAdminOnly: false,
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
		const memberId = message.author.id;

		const embed = this.createEmbed();

		const subs = await this.client.db.getPremiumSubscriptionsForMember(memberId, true);
		const guildSubs = subs ? await this.client.db.getPremiumSubscriptionGuildsForMember(memberId) : [];

		if (!action) {
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
			} else {
				embed.title = t('cmd.premium.premium.title');

				const maxDate = subs.reduce((acc, sub) => Math.max(acc, moment(sub.validUntil).unix()), 0);
				const date = moment.unix(maxDate).locale(lang).fromNow(true);

				let guildList = '';
				guildSubs.forEach((guildSub) => {
					const guildName = guildSub.guildName;
					guildList += `- **${guildName}**` + (guildSub.guildId === guildId ? ' *(This server)*' : '') + '\n';
				});
				if (guildId) {
					if (guildSubs.some((s) => s.guildId === guildId)) {
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

				const limit = `**${guildSubs.length}/${subs.reduce((acc, sub) => Math.max(acc, sub.maxGuilds), 0)}**`;

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
				} else if (!message.member.permission.has(GuildPermission.MANAGE_GUILD)) {
					embed.description = t('cmd.premium.activate.permissions');
				} else if (!subs) {
					embed.description = t('cmd.premium.activate.noSubscription', {
						cmd: '`' + settings.prefix + 'premium`'
					});
				} else {
					const maxGuilds = subs.reduce((acc, sub) => Math.max(acc, sub.maxGuilds), 0);
					if (guildSubs.length >= maxGuilds) {
						embed.description = t('cmd.premium.activate.maxGuilds');
					} else {
						await this.client.db.savePremiumSubscriptionGuild({
							memberId,
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
				} else if (!message.member.permission.has(GuildPermission.MANAGE_GUILD)) {
					embed.description = t('cmd.premium.deactivate.permissions');
				} else if (!isPremium) {
					embed.description = t('cmd.premium.deactivate.noSubscription');
				} else {
					await this.client.db.removePremiumSubscriptionGuild(memberId, guildId);

					this.client.cache.premium.flush(guildId);

					embed.description = t('cmd.premium.deactivate.done');
				}
			} else if (action === Action.Check) {
				embed.title = t('cmd.premium.check.title');

				const res = await this.client.premium.checkPatreon(memberId);

				if (res === 'not_found') {
					embed.description = t('cmd.premium.check.notFound');
				} else if (res === 'declined') {
					embed.description = t('cmd.premium.check.declined');
				} else if (res === 'paused') {
					embed.description = t('cmd.premium.check.paused');
				} else {
					embed.description = t('cmd.premium.check.done', {
						valid: res.locale(lang).calendar(),
						cmd: '`' + settings.prefix + 'premium`'
					});
				}
			}
		}

		return this.sendReply(message, embed);
	}
}
