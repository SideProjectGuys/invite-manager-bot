import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { TextChannel } from 'discord.js';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { checkProBot } from '../../middleware';
import { CommandGroup, RP } from '../../types';

const { resolve, expect, localize } = Middleware;
const { using } = CommandDecorators;

const config = require('../../../config.json');

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'feedback',
			aliases: ['suggestion', 'suggestions'],
			desc: 'Give feedback about the bot to the developers',
			usage: '<prefix>feedback <message>',
			info:
				'`message`:\n' +
				'The message you would like to submit as feedback.\n\n',
			group: CommandGroup.Info,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(resolve('...feedback: String'))
	@using(expect('...feedback: String'))
	@using(localize)
	public async action(
		message: Message,
		[rp, feedback]: [RP, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		// Feature: Add history of commands the user entered to see possible errors and what he tried to do

		if (config.feedbackChannel) {
			// tslint:disable-next-line
			let channel = <TextChannel>(
				message.client.channels.get(config.feedbackChannel)
			);

			const embedFeedback = createEmbed(this.client);
			embedFeedback.setAuthor(
				`${message.author.username}#${message.author.discriminator}`,
				message.author.avatarURL()
			);
			embedFeedback.addField(
				'Guild',
				`${message.guild.id} - ${message.guild.name}`
			);
			embedFeedback.addField('Message', `${feedback}`);
			embedFeedback.addField('User ID', message.author.id);

			return channel.send({ embed: embedFeedback }).then(() => {
				const embed = createEmbed(this.client);
				embed.setDescription(rp.CMD_FEEDBACK_TEXT());

				let linksArray = [];
				if (config.botSupport) {
					linksArray.push(
						`[${rp.BOT_SUPPORT_DISCORD_TITLE()}](${config.botSupport})`
					);
				}
				if (config.botAdd) {
					linksArray.push(`[${rp.BOT_INVITE_TITLE()}](${config.botAdd})`);
				}
				if (config.botWebsite) {
					linksArray.push(`[${rp.BOT_WEBSITE_TITLE()}](${config.botWebsite})`);
				}
				if (config.botPatreon) {
					linksArray.push(`[${rp.BOT_PATREON_TITLE()}](${config.botPatreon})`);
				}

				embed.addField(rp.CMD_FEEDBACK_LINKS(), linksArray.join(` | `));

				return sendReply(message, embed);
			});
		}
	}
}
