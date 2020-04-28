import { Message } from 'eris';

import { CommandContext, IMCommand } from '../../framework/commands/Command';
import { Cache } from '../../framework/decorators/Cache';
import { Service } from '../../framework/decorators/Service';
import { IMModule } from '../../framework/Module';
import { ArrayResolver, StringResolver } from '../../framework/resolvers';
import { FaqListCache } from '../cache/FaqListCache';
import { FaqList } from '../models/FaqList';
import { FaqListService } from '../services/FaqListService';

export default class extends IMCommand {
	@Service() private faqList: FaqListService;
	@Cache() private faqListCache: FaqListCache;

	public constructor(module: IMModule) {
		super(module, {
			name: 'faq-list-add',
			aliases: ['faqListAdd'],
			args: [
				{
					name: 'faqListKey',
					resolver: StringResolver,
					required: true
				},
				{
					name: 'faqKeys',
					resolver: new ArrayResolver(module.client, StringResolver)
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
		[faqListKey, faqKeys]: [string, string[]],
		{ remove }: { remove: boolean },
		{ t, guild }: CommandContext
	): Promise<any> {
		const faqList: FaqList = {
			guildId: guild.id,
			key: faqListKey,
			faqKeys: faqKeys
		};
		await this.faqList.saveFaqList(faqList);

		const faqLists = await this.faqListCache.get(guild.id);
		faqLists.push(faqList);
		await this.faqListCache.set(guild.id, faqLists);

		await this.sendReply(message, `FAQ List ${faqList.key} added!`);
	}
}
