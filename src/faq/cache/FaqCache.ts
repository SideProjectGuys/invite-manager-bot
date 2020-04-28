import { IMCache } from '../../framework/cache/Cache';
import { Service } from '../../framework/decorators/Service';
import { Faq } from '../models/Faq';
import { FaqService } from '../services/FaqService';

export class FaqCache extends IMCache<Faq[]> {
	@Service() private faq: FaqService;

	public async init() {
		// NO-OP
	}

	protected async _get(guildId: string): Promise<Faq[]> {
		return this.faq.getFaqsForGuild(guildId);
	}
}
