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
			name: 'faq-delete',
			aliases: ['faqDelete'],
			args: [
				{
					name: 'faqKey',
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
		[faqKey]: [string],
		{ remove }: { remove: boolean },
		{ t, guild }: CommandContext
	): Promise<any> {
		await this.faq.removeFaq(guild.id, faqKey);

		const faqs = await this.faqCache.get(guild.id);
		await this.faqCache.set(
			guild.id,
			faqs.filter((faq) => faq.key !== faqKey)
		);

		await this.sendReply(message, `FAQ ${faqKey} removed!`);
	}
}
