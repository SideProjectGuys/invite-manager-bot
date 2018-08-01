import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { TemplateData } from '@yamdbf/core/bin/types/TemplateData';

import { IMClient } from '../../client';
import { SettingsCache } from '../../utils/SettingsCache';
import { CommandGroup, createEmbed, RP, sendEmbed } from '../../utils/util';

const { resolve, localize } = Middleware;
const { using } = CommandDecorators;

interface FAQ {
	name: string;
	aliases: string[];
	key: string;
}

// Add an index signature to the RP interface because we access
// the correct FAQ by string index. Don't add this to the original
// because we lose some type safety if all string indexes are valid
interface AnyRP extends RP {
	[x: string]: (data: TemplateData) => string;
}

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	private faqs: FAQ[] = [];

	public constructor() {
		super({
			name: 'faq',
			aliases: ['setup'],
			desc: 'Show frequently asked questions.',
			usage: '<prefix>faq',
			group: CommandGroup.Other,
			guildOnly: true
		});

		this.faqs = require('../../../faqs.json');
	}

	@using(resolve('faqName: String'))
	@using(localize)
	public async action(
		message: Message,
		[rp, faqName]: [AnyRP, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const showAll = faqName === 'all';
		const prefix = (await SettingsCache.get(message.guild.id)).prefix;
		const bot = '@' + message.guild.me.displayName;

		const embed = createEmbed(this.client);

		if (!faqName || showAll) {
			this.faqs.forEach(faq => {
				embed.addField(
					rp[faq.key + '_Q']({ prefix, bot }),
					showAll
						? rp[faq.key + '_A']({ prefix, bot })
						: '`' + prefix + 'faq ' + faq.name + '`'
				);
			});
			embed.addField(rp.CMD_FAQ_MORE_TITLE(), rp.CMD_FAQ_MORE_TEXT());
		} else {
			let faq = this.faqs.find(
				el => el.name === faqName || el.aliases.some(f => f === faqName)
			);
			if (faq) {
				embed.setTitle(rp[faq.key + '_Q']({ prefix, bot }));
				embed.setDescription(rp[faq.key + '_A']({ prefix, bot }));
			} else {
				embed.setTitle(rp.CMD_FAQ_NOT_FOUND({ name: faqName }));
			}
		}

		sendEmbed(message.channel, embed, message.author);
	}
}
