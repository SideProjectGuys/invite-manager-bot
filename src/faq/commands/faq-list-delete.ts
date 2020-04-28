import { Message } from 'eris';

import { CommandContext, IMCommand } from '../../framework/commands/Command';
import { Cache } from '../../framework/decorators/Cache';
import { Service } from '../../framework/decorators/Service';
import { IMModule } from '../../framework/Module';
import { StringResolver } from '../../framework/resolvers';
import { FaqListCache } from '../cache/FaqListCache';
import { FaqListService } from '../services/FaqListService';

export default class extends IMCommand {
	@Service() private faqList: FaqListService;
	@Cache() private faqListCache: FaqListCache;

	public constructor(module: IMModule) {
		super(module, {
			name: 'faq-list-delete',
			aliases: ['faqListDelete'],
			args: [
				{
					name: 'faqListKey',
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
		[faqListKey]: [string],
		{ remove }: { remove: boolean },
		{ t, guild }: CommandContext
	): Promise<any> {
		await this.faqList.removeFaqList(guild.id, faqListKey);

		const faqs = await this.faqListCache.get(guild.id);
		await this.faqListCache.set(
			guild.id,
			faqs.filter((faqList) => faqList.key !== faqListKey)
		);

		await this.sendReply(message, `FAQ List ${faqListKey} removed!`);
	}
}
