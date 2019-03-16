import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../client';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

const config = require('../../../config.json');

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.botInfo,
			aliases: ['bot-info'],
			group: CommandGroup.Info,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		flags: {},
		{ t, settings, isPremium }: Context
	): Promise<any> {
		const lang = settings.lang;

		const counts = await this.client.getCounts();

		const embed = this.createEmbed();

		// Version
		embed.fields.push({
			name: t('cmd.botInfo.version'),
			value: this.client.version,
			inline: true
		});

		// Uptime
		embed.fields.push({
			name: t('cmd.botInfo.uptime'),
			value: moment
				.duration(moment().diff(this.client.startedAt))
				.locale(lang)
				.humanize(),
			inline: true
		});

		// Guild count
		embed.fields.push({
			name: t('cmd.botInfo.guilds'),
			value: counts.guilds.toString(),
			inline: true
		});

		// Member count
		embed.fields.push({
			name: t('cmd.botInfo.members'),
			value: counts.members.toString(),
			inline: true
		});

		// Shard info
		embed.fields.push({
			name: t('cmd.botInfo.shards.current'),
			value: this.client.shardId.toString(),
			inline: true
		});
		embed.fields.push({
			name: t('cmd.botInfo.shards.total'),
			value: this.client.shardCount.toString(),
			inline: true
		});

		// Premium
		embed.fields.push({
			name: t('cmd.botInfo.premium.title'),
			value: isPremium
				? t('cmd.botInfo.premium.active')
				: t('cmd.botInfo.premium.none')
		});

		// Support discord
		if (config.bot.links.support) {
			embed.fields.push({
				name: t('bot.supportDiscord.title'),
				value: config.bot.links.support
			});
		}
		// Add bot
		if (config.bot.links.add) {
			embed.fields.push({
				name: t('bot.invite.title'),
				value: config.bot.links.add
			});
		}
		// Bot website
		if (config.bot.links.website) {
			embed.fields.push({
				name: t('bot.website.title'),
				value: config.bot.links.website
			});
		}
		// Patreon
		if (config.bot.links.patreon) {
			embed.fields.push({
				name: t('bot.patreon.title'),
				value: config.bot.links.patreon
			});
		}

		return this.sendReply(message, embed);
	}
}
