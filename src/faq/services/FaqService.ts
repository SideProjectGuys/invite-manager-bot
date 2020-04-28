import { Service } from '../../framework/decorators/Service';
import { DatabaseService } from '../../framework/services/Database';
import { IMService } from '../../framework/services/Service';
import { Faq } from '../models/Faq';

enum TABLE {
	faq = '`faq`'
}

export class FaqService extends IMService {
	@Service() private db: DatabaseService;

	public async getFaqsForGuild(guildId: string) {
		return this.db.findMany<Faq>(guildId, TABLE.faq, '`guildId` = ?', [guildId]);
	}
	public async saveFaq(faq: Partial<Faq>) {
		return this.db.insertOrUpdate(
			TABLE.faq,
			['guildId', 'key', 'question', 'answer', 'numberOfUsages', 'enableAutoAnswer', 'numberOfAutoUsages'],
			['question', 'answer', 'numberOfUsages', 'enableAutoAnswer', 'numberOfAutoUsages'],
			[faq],
			(f: Partial<Faq>) => f.guildId
		);
	}
	public async removeFaq(guildId: string, faqKey: string) {
		await this.db.delete(guildId, TABLE.faq, '`guildId` = ? AND `key` = ?', [guildId, faqKey]);
	}
}
