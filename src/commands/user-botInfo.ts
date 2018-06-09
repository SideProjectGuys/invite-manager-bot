import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message
} from '@yamdbf/core';
import moment from 'moment';

import { IMClient } from '../client';
import { CommandGroup, createEmbed, RP, sendEmbed } from '../utils/util';

const { localizable } = CommandDecorators;

const config = require('../../config.json');

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'bot-info',
			aliases: ['botInfo'],
			desc: 'Show info about the bot',
			usage: '<prefix>botInfo',
			group: CommandGroup.Other
		});
	}

	@localizable
	public async action(message: Message, [rp]: [RP]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		moment.locale(await message.guild.storage.settings.get('lang'));

		const numGuilds = await this.client.getGuildsCount();
		const numMembers = await this.client.getMembersCount();

		const embed = createEmbed(this.client);

		// Version
		embed.addField(rp.CMD_BOTINFO_VERSION(), this.client.version, true);

		// Uptime
		embed.addField(
			rp.CMD_BOTINFO_UPTIME(),
			moment.duration(moment().diff(this.client.startedAt)).humanize(),
			true
		);

		// Guild count
		embed.addField(rp.CMD_BOTINFO_GUILDS(), numGuilds, true);

		// Member count
		embed.addField(rp.CMD_BOTINFO_MEMBERS(), numMembers, true);

		// Shard info
		if (this.client.shard) {
			embed.addField(
				rp.CMD_BOTINFO_SHARD_CURRENT(),
				this.client.shard.id + 1,
				true
			);
			embed.addField(
				rp.CMD_BOTINFO_SHARD_TOTAL(),
				this.client.shard.count,
				true
			);
		}

		// Support discord
		if (config.botSupport) {
			embed.addField(rp.BOT_SUPPORT_DISCORD_TITLE(), config.botSupport);
		}
		// Add bot
		if (config.botAdd) {
			embed.addField(rp.BOT_INVITE_TITLE(), config.botAdd);
		}
		// Bot website
		if (config.botWebsite) {
			embed.addField(rp.BOT_WEBSITE_TITLE(), config.botWebsite);
		}
		// Patreon
		if (config.botPatreon) {
			embed.addField(rp.BOT_PATREON_TITLE(), config.botPatreon);
		}

		sendEmbed(message.channel, embed, message.author);
	}
}
