import { RichEmbed } from 'discord.js';
import { Command, Logger, logger, Message } from 'yamdbf';

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
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		// TODO: This is currently multiplied by the shard count, which is ok for guilds,
		// but inaccurate for the members count
		const guildCount =
			this.client.shard && this.client.shard.count > 1
				? '~' + message.client.guilds.size * this.client.shard.count
				: message.client.guilds.size;

		const embed = createEmbed(this.client);
		embed.addField('Guilds', guildCount, true);
		if (config.botSupport) {
			embed.addField('Support Discord', config.botSupport);
		}
		if (config.botAdd) {
			embed.addField('Add bot to your server', config.botAdd);
		}
		if (config.botWebsite) {
			embed.addField('Bot website', config.botWebsite);
		}
		if (config.botPatreon) {
			embed.addField('Patreon', config.botPatreon);
		}

		sendEmbed(message.channel, embed, message.author);
	}
}
