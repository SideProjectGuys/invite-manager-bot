import {
	Client,
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { MessageAttachment, User } from 'discord.js';

import { SettingsCache } from '../utils/SettingsCache';
import { CommandGroup, createEmbed, sendEmbed } from '../utils/util';

const generateCsv = require('csv-generate');

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<Client> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'export',
			aliases: [],
			desc: 'Export data of invite manager to a csv sheet',
			usage: '<prefix>export',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Premium,
			hidden: true
		});
	}

	public async action(message: Message): Promise<any> {
		this._logger.log(
			`${message.guild ? message.guild.name : 'DM'} (${message.author.username}): ${message.content}`
		);

		const embed = createEmbed(this.client);
		embed.setTitle(`Export`);

		const isPremium = await SettingsCache.isPremium(message.guild.id);
		if (!isPremium) {
			embed.setDescription(`This command is only available for premium subscribers!`);
			sendEmbed(message.channel, embed, message.author);
		} else {
			embed.setDescription(`Please wait while we prepare the file...`);

			// TODO: Get data from database (what data do we want to export?)
			var generator = generateCsv({ columns: ['int', 'bool'], length: 2 });

			sendEmbed(message.channel, embed, message.author).then(msg => {
				let attachment = new MessageAttachment(generator, 'InviteManagerExport.csv');
				message.channel.send(attachment).then(() => {
					if (!Array.isArray(msg)) {
						msg.delete();
					}
				});
			});
		}
	}
}
