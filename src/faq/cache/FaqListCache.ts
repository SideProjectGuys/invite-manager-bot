import { IMCache } from '../../framework/cache/Cache';
import { Service } from '../../framework/decorators/Service';
import { FaqList } from '../models/FaqList';
import { FaqListService } from '../services/FaqListService';

export class FaqListCache extends IMCache<FaqList[]> {
	@Service() private faqList: FaqListService;

	public async init() {
		// NO-OP
	}

	protected async _get(guildId: string): Promise<FaqList[]> {
		return this.faqList.getFaqListsForGuild(guildId);
	}
}
