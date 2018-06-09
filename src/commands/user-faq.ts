import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';

import { IMClient } from '../client';
import { CommandGroup, createEmbed, RP, sendEmbed } from '../utils/util';

const { resolve } = Middleware;
const { using, localizable } = CommandDecorators;

interface FAQ {
	name: string;
	aliases: string[];
	question: string;
	answer: string;
}

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'faq',
			aliases: ['setup'],
			desc: 'Show frequently asked questions.',
			usage: '<prefix>faq',
			group: CommandGroup.Other,
			guildOnly: true
		});
	}

	@using(resolve('faqName: String'))
	@localizable
	public async action(
		message: Message,
		[rp, faqName]: [RP, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const faqs: FAQ[] = require('../../faqs.json');

		const embed = createEmbed(this.client);

		if (!faqName) {
			faqs.forEach(faq => {
				embed.addField(faq.question, '`!faq ' + faq.name + '`');
			});
			embed.addField(rp.CMD_FAQ_MORE_TITLE(), rp.CMD_FAQ_MORE_TEXT());
		} else {
			let faq = faqs.find(
				el => el.name === faqName || el.aliases.some(f => f === faqName)
			);
			if (faq) {
				embed.setTitle(faq.question);
				embed.setDescription(faq.answer);
			} else {
				embed.setTitle(rp.CMD_FAQ_NOT_FOUND({ name: faqName }));
			}
		}

		sendEmbed(message.channel, embed, message.author);
	}
}
