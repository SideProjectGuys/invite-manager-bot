import { IMCache } from '../../framework/cache/Cache';
import { Service } from '../../framework/decorators/Service';
import { Rank } from '../models/Rank';
import { RanksService } from '../services/Ranks';

export class RanksCache extends IMCache<Rank[]> {
	@Service() private ranks: RanksService;

	public async init() {
		// NO-OP
	}

	protected async _get(guildId: string): Promise<Rank[]> {
		const ranks = await this.ranks.getRanksForGuild(guildId);
		return ranks.sort((a, b) => a.numInvites - b.numInvites);
	}
}
