import { Message } from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { BotCommand, BotType, CommandGroup } from '../../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.botInfo,
			aliases: ['bot-info'],
			group: CommandGroup.Info,
			defaultAdminOnly: false,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		flags: {},
		{ t, guild, settings, isPremium }: Context
	): Promise<any> {
		const lang = settings.lang;

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
			value: moment.duration(moment().diff(this.client.startedAt)).locale(lang).humanize(),
			inline: true
		});

		// Shard info
		embed.fields.push({
			name: t('cmd.botInfo.shards.current'),
			value: `${this.client.shardId} (${this.client.db.getDbShardForGuild(guild.id)})`,
			inline: true
		});

		// Premium
		embed.fields.push({
			name: t('cmd.botInfo.premium.title'),
			value:
				this.client.type === BotType.custom
					? '**' + t('cmd.botInfo.premium.custom') + '**'
					: isPremium
					? t('cmd.botInfo.premium.active')
					: t('cmd.botInfo.premium.none')
		});

		// Support discord
		if (this.client.config.bot.links.support) {
			embed.fields.push({
				name: t('bot.supportDiscord.title'),
				value: this.client.config.bot.links.support
			});
		}
		// Add bot
		if (this.client.config.bot.links.add) {
			embed.fields.push({
				name: t('bot.invite.title'),
				value: this.client.config.bot.links.add
			});
		}
		// Bot website
		if (this.client.config.bot.links.website) {
			embed.fields.push({
				name: t('bot.website.title'),
				value: this.client.config.bot.links.website
			});
		}
		// Patreon
		if (this.client.config.bot.links.patreon) {
			embed.fields.push({
				name: t('bot.patreon.title'),
				value: this.client.config.bot.links.patreon
			});
		}

		return this.sendReply(message, embed);
	}
}
