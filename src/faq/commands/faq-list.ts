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
			name: 'faq-list',
			aliases: ['faqList'],
			args: [
				{
					name: 'faqListKey',
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
		[faqListKey]: [string],
		{ remove }: { remove: boolean },
		{ t, guild }: CommandContext
	): Promise<any> {
		const faqLists = await this.faqListCache.get(guild.id);
		console.log('faqLists', faqLists);
		const embed = this.createEmbed();

		faqLists.forEach((faqList) => {
			if (faqList.faqKeys) {
				embed.fields.push({
					name: `${faqList.key}`,
					value: faqList.faqKeys.join(', ')
				});
			}
		});

		await this.sendReply(message, embed);
	}
}
