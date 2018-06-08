import { Command, Logger, logger, Message } from '@yamdbf/core';
import moment from 'moment';

import { IMClient } from '../client';
import { CommandGroup, createEmbed, sendEmbed } from '../utils/util';

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

	public async action(message: Message, args: string[]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const numGuilds = await this.client.getGuildsCount();
		const numMembers = await this.client.getMembersCount();

		const embed = createEmbed(this.client);

		// Version
		embed.addField('Version', this.client.version, true);

		// Uptime
		embed.addField(
			'Uptime',
			moment.duration(moment().diff(this.client.startedAt)).humanize(),
			true
		);

		// Guild count
		embed.addField('Guilds', numGuilds, true);

		// Member count
		embed.addField('Members', numMembers, true);

		// Shard info
		if (this.client.shard) {
			embed.addField('Current Shard', this.client.shard.id + 1, true);
			embed.addField('Total Shards', this.client.shard.count, true);
		}

		// Support discord
		if (config.botSupport) {
			embed.addField('Support Discord', config.botSupport);
		}
		// Add bot
		if (config.botAdd) {
			embed.addField('Add bot to your server', config.botAdd);
		}
		// Bot website
		if (config.botWebsite) {
			embed.addField('Bot website', config.botWebsite);
		}
		// Patreon
		if (config.botPatreon) {
			embed.addField('Patreon', config.botPatreon);
		}

		sendEmbed(message.channel, embed, message.author);
	}
}
