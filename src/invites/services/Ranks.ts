import { Service } from '../../framework/decorators/Service';
import { DatabaseService } from '../../framework/services/Database';
import { IMService } from '../../framework/services/Service';
import { Rank } from '../models/Rank';

enum TABLE {
	ranks = '`ranks`'
}

export class RanksService extends IMService {
	@Service() private db: DatabaseService;

	public async getRanksForGuild(guildId: string) {
		return this.db.findMany<Rank>(guildId, TABLE.ranks, '`guildId` = ?', [guildId]);
	}
	public async saveRank(rank: Partial<Rank>) {
		await this.db.insertOrUpdate(
			TABLE.ranks,
			['guildId', 'roleId', 'numInvites', 'description'],
			['numInvites', 'description'],
			[rank],
			(r) => r.guildId
		);
	}
	public async removeRank(guildId: string, roleId: string) {
		await this.db.delete(guildId, TABLE.ranks, `\`roleId\` = ?`, [roleId]);
	}
}
