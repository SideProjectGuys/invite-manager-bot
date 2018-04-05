import { RichEmbed, TextChannel } from 'discord.js';
import { Client, Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { createEmbed } from '../utils/util';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

const config = require('../../config.json');

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'feedback',
			aliases: ['suggestion', 'suggestions'],
			desc: 'Give feedback about the bot to the developers',
			usage: '<prefix>feedback [message]',
			guildOnly: true
		});
	}

	@using(resolve('...feedback: String'))
	@using(expect('...feedback: String'))
	public async action(message: Message, feedback: [string]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		// Feature: Add history of commands the user entered to see possible errors and what he tried to do

		if (config.feedbackChannel) {
			// tslint:disable-next-line
			let channel = <TextChannel>message.client.channels.get(config.feedbackChannel);

			const embedFeedback = new RichEmbed();
			embedFeedback.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL);
			embedFeedback.addField('Guild', `${message.guild.id} - ${message.guild.name}`);
			embedFeedback.addField('Message', `${feedback}`);
			createEmbed(message.client, embedFeedback);
			channel.send({ embed: embedFeedback }).then(() => {
				const embed = new RichEmbed();
				embed.setDescription('Thank you for your feedback! ' +
					'If you need personal assistance please join our support discord server.');
				embed.addField('Links', `[Support Discord](${config.botSupport}) | ' + 
					'[Invite this bot to your server](${config.botAdd}) | [Website](${config.botWebsite})`);
				createEmbed(message.client, embed);
				message.channel.send({ embed });
			});
		}
	}
}
