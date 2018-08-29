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
			desc: 'Show info about the bot',
			group: CommandGroup.Info,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ t, settings }: Context
	): Promise<any> {
		const lang = settings.lang;

		const numGuilds = await this.client.getGuildsCount();
		const numMembers = await this.client.getMembersCount();

		const embed = this.client.createEmbed();

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
			value: numGuilds.toString(),
			inline: true
		});

		// Member count
		embed.fields.push({
			name: t('cmd.botInfo.members'),
			value: numMembers.toString(),
			inline: true
		});

		// Shard info
		embed.fields.push({
			name: t('cmd.botInfo.shards.current'),
			value: (this.client.shardId + 1).toString(),
			inline: true
		});
		embed.fields.push({
			name: t('cmd.botInfo.shards.total'),
			value: this.client.shardCount.toString(),
			inline: true
		});

		// Support discord
		if (config.botSupport) {
			embed.fields.push({
				name: t('bot.supportDiscord.title'),
				value: config.botSupport
			});
		}
		// Add bot
		if (config.botAdd) {
			embed.fields.push({ name: t('bot.invite.title'), value: config.botAdd });
		}
		// Bot website
		if (config.botWebsite) {
			embed.fields.push({
				name: t('bot.website.title'),
				value: config.botWebsite
			});
		}
		// Patreon
		if (config.botPatreon) {
			embed.fields.push({
				name: t('bot.patreon.title'),
				value: config.botPatreon
			});
		}

		return this.client.sendReply(message, embed);
	}
}
