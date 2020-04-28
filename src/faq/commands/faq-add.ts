import { Message } from 'eris';

import { CommandContext, IMCommand } from '../../framework/commands/Command';
import { Cache } from '../../framework/decorators/Cache';
import { Service } from '../../framework/decorators/Service';
import { IMModule } from '../../framework/Module';
import { StringResolver } from '../../framework/resolvers';
import { FaqCache } from '../cache/FaqCache';
import { Faq } from '../models/Faq';
import { FaqService } from '../services/FaqService';

export default class extends IMCommand {
	@Service() private faq: FaqService;
	@Cache() private faqCache: FaqCache;

	public constructor(module: IMModule) {
		super(module, {
			name: 'faq-add',
			aliases: ['faqAdd'],
			args: [
				{
					name: 'faqKey',
					resolver: StringResolver,
					required: true
				},
				{
					name: 'faqQuestion',
					resolver: StringResolver,
					required: true
				},
				{
					name: 'faqAnswer',
					resolver: StringResolver,
					required: true
				}
			],
			flags: [],
			group: 'Faq',
			botPermissions: [],
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(
		message: Message,
		[faqKey, faqQuestion, faqAnswer]: [string, string, string],
		{ remove }: { remove: boolean },
		{ t, guild }: CommandContext
	): Promise<any> {
		const faq: Faq = {
			guildId: guild.id,
			key: faqKey,
			question: faqQuestion,
			answer: faqAnswer,
			numberOfUsages: 0,
			enableAutoAnswer: false,
			numberOfAutoUsages: 0
		};
		await this.faq.saveFaq(faq);

		const faqs = await this.faqCache.get(guild.id);
		faqs.push(faq);
		await this.faqCache.set(guild.id, faqs);

		await this.sendReply(message, `FAQ ${faq.key} added!`);
	}
}
