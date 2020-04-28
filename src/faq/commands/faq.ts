import { Message } from 'eris';

import { CommandContext, IMCommand } from '../../framework/commands/Command';
import { Cache } from '../../framework/decorators/Cache';
import { Service } from '../../framework/decorators/Service';
import { IMModule } from '../../framework/Module';
import { StringResolver } from '../../framework/resolvers';
import { FaqCache } from '../cache/FaqCache';
import { FaqService } from '../services/FaqService';

export default class extends IMCommand {
	@Service() private faq: FaqService;
	@Cache() private faqCache: FaqCache;

	public constructor(module: IMModule) {
		super(module, {
			name: 'faq',
			aliases: [],
			args: [
				{
					name: 'faqKey',
					resolver: StringResolver
				}
			],
			flags: [],
			group: 'Faq',
			botPermissions: [],
			guildOnly: true,
			defaultAdminOnly: false
		});
	}

	public async action(
		message: Message,
		[faqKey]: [string],
		{ remove }: { remove: boolean },
		{ t, guild }: CommandContext
	): Promise<any> {
		const faqs = await this.faqCache.get(guild.id);
		console.log('faq', faqs);
		const embed = this.createEmbed();

		faqs.forEach((faq) => {
			embed.fields.push({
				name: `${faq.key} - ${faq.question}`,
				value: faq.answer
			});
		});

		await this.sendReply(message, embed);
	}
}
