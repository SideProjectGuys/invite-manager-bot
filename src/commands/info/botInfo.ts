import { Guild, Message } from 'eris';
import moment from 'moment';

import { createEmbed, sendReply } from '../../functions/Messaging';
import { SettingsCache } from '../../storage/SettingsCache';
import { CommandGroup } from '../../types';
import { Command, TranslateFunc } from '../Command';

const config = require('../../../config.json');

export default class extends Command {
	public constructor() {
		super({
			name: 'bot-info',
			aliases: ['botInfo'],
			desc: 'Show info about the bot',
			usage: '<prefix>botInfo',
			group: CommandGroup.Info
		});
	}

	public async action(
		guild: Guild,
		message: Message,
		args: [],
		t: TranslateFunc
	): Promise<any> {
		const lang = (await SettingsCache.get(guild.id)).lang;

		const numGuilds = await this.client.getGuildsCount();
		const numMembers = await this.client.getMembersCount();

		const embed = createEmbed(this.client);

		// Version
		embed.fields.push({
			name: t('CMD_BOTINFO_VERSION'),
			value: this.client.version,
			inline: true
		});

		// Uptime
		embed.fields.push({
			name: t('CMD_BOTINFO_UPTIME'),
			value: moment
				.duration(moment().diff(this.client.startedAt))
				.locale(lang)
				.humanize(),
			inline: true
		});

		// Guild count
		embed.fields.push({
			name: t('CMD_BOTINFO_GUILDS'),
			value: numGuilds.toString(),
			inline: true
		});

		// Member count
		embed.fields.push({
			name: t('CMD_BOTINFO_MEMBERS'),
			value: numMembers.toString(),
			inline: true
		});

		// Shard info
		embed.fields.push({
			name: t('CMD_BOTINFO_SHARD_CURRENT'),
			value: (this.client.shardId + 1).toString(),
			inline: true
		});
		embed.fields.push({
			name: t('CMD_BOTINFO_SHARD_TOTAL'),
			value: this.client.numShards.toString(),
			inline: true
		});

		// Support discord
		if (config.botSupport) {
			embed.fields.push({
				name: t('BOT_SUPPORT_DISCORD_TITLE'),
				value: config.botSupport
			});
		}
		// Add bot
		if (config.botAdd) {
			embed.fields.push({ name: t('BOT_INVITE_TITLE'), value: config.botAdd });
		}
		// Bot website
		if (config.botWebsite) {
			embed.fields.push({
				name: t('BOT_WEBSITE_TITLE'),
				value: config.botWebsite
			});
		}
		// Patreon
		if (config.botPatreon) {
			embed.fields.push({
				name: t('BOT_PATREON_TITLE'),
				value: config.botPatreon
			});
		}

		return sendReply(this.client, message, embed);
	}
}
