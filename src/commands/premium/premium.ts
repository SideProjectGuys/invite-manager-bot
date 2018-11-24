import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../client';
import { EnumResolver } from '../../resolvers';
import {
	guilds,
	premiumSubscriptionGuilds,
	premiumSubscriptions,
	sequelize
} from '../../sequelize';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

enum Action {
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
			guildOnly: true,
			strict: true
		});
	}

	public async action(
		message: Message,
		[action]: [Action],
		{ guild, t, settings, isPremium }: Context
	): Promise<any> {
		// TODO: Create list of premium features (also useful for FAQ)
		const lang = settings.lang;

		const embed = this.client.createEmbed();

		const sub = await premiumSubscriptions.findOne({
			where: {
				memberId: message.author.id,
				validUntil: {
					[sequelize.Op.gte]: new Date()
				}
			}
		});

		if (!action) {
			if (!sub) {
				embed.title = t('cmd.premium.noPremium.title');
				embed.description = t('cmd.premium.noPremium.text');

				embed.fields.push({
					name: t('cmd.premium.feature.embeds.title'),
					value: t('cmd.premium.feature.embeds.text', {
						link:
							'https://docs.invitemanager.co/bot/custom-messages/join-message-examples'
					})
				});

				embed.fields.push({
					name: t('cmd.premium.feature.export.title'),
					value: t('cmd.premium.feature.export.text')
				});
			} else {
				embed.title = t('cmd.premium.premium.title');

				const date = moment(sub.validUntil)
					.locale(lang)
					.fromNow(true);

				const allGuildSubs = await premiumSubscriptionGuilds.findAll({
					where: {
						premiumSubscriptionId: sub.id
					},
					include: [
						{
							attributes: ['name'],
							model: guilds,
							required: true
						}
					],
					raw: true
				});

				let guildList = '';
				allGuildSubs.forEach((guildSub: any) => {
					const guildName = guildSub['guild.name'];
					guildList +=
						`- **${guildName}**` +
						(guildSub.guildId === guild.id ? ' *(This server)*' : '') +
						'\n';
				});

				const limit = `**${allGuildSubs.length}/${sub.maxGuilds}**`;

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

				if (isPremium) {
					embed.description = t('cmd.premium.activate.currentlyActive');
				} else {
					if (!sub) {
						embed.description = t('cmd.premium.activate.noSubscription');
					} else {
						const subs = await premiumSubscriptionGuilds.count({
							where: {
								premiumSubscriptionId: sub.id
							}
						});

						if (subs > sub.maxGuilds) {
							embed.description = t('cmd.premium.activate.maxGuilds');
						} else {
							await premiumSubscriptionGuilds.create({
								id: null,
								premiumSubscriptionId: sub.id,
								guildId: guild.id
							});

							this.client.cache.premium.flush(guild.id);

							embed.description = t('cmd.premium.activate.done');
						}
					}
				}
			} else if (action === Action.Deactivate) {
				embed.title = t('cmd.premium.deactivate.title');

				if (isPremium) {
					await premiumSubscriptionGuilds.destroy({
						where: {
							premiumSubscriptionId: sub.id,
							guildId: guild.id
						}
					});

					embed.description = t('cmd.premium.deactivate.done');
				} else {
					embed.description = t('cmd.premium.deactivate.noSubscription');
				}
			}
		}

		return this.client.sendReply(message, embed);
	}
}
