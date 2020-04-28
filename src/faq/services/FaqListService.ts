import { Service } from '../../framework/decorators/Service';
import { DatabaseService } from '../../framework/services/Database';
import { IMService } from '../../framework/services/Service';
import { FaqList } from '../models/FaqList';

enum TABLE {
	faqList = '`faqList`'
}

export class FaqListService extends IMService {
	@Service() private db: DatabaseService;

	public async getFaqListsForGuild(guildId: string) {
		return this.db.findMany<FaqList>(guildId, TABLE.faqList, '`guildId` = ?', [guildId]);
	}
	public async saveFaqList(faq: Partial<FaqList>) {
		return this.db.insertOrUpdate(
			TABLE.faqList,
			['guildId', 'key', 'faqKeys'],
			['faqKeys'],
			[faq],
			(f: Partial<FaqList>) => f.guildId
		);
	}
	public async removeFaqList(guildId: string, faqListKey: string) {
		await this.db.delete(guildId, TABLE.faqList, '`guildId` = ? AND `key` = ?', [guildId, faqListKey]);
	}
}
