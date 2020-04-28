import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { FaqCache } from './cache/FaqCache';
import { FaqListCache } from './cache/FaqListCache';
import faq from './commands/faq';
import faqAdd from './commands/faq-add';
import faqDelete from './commands/faq-delete';
import faqList from './commands/faq-list';
import faqListAdd from './commands/faq-list-add';
import { FaqListService } from './services/FaqListService';
import { FaqService } from './services/FaqService';

export class FaqModule extends IMModule {
	public name: string = 'FAQ';

	public constructor(client: IMClient) {
		super(client);

		// Services
		this.registerService(FaqService);
		this.registerService(FaqListService);

		// Caches
		this.registerCache(FaqCache);
		this.registerCache(FaqListCache);

		// Commands
		this.registerCommand(faq);
		this.registerCommand(faqAdd);
		this.registerCommand(faqDelete);
		this.registerCommand(faqList);
		this.registerCommand(faqListAdd);
	}
}
