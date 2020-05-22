import { IMCache } from '../../framework/cache/Cache';
import { Service } from '../../framework/decorators/Service';
import { StrikeConfig } from '../models/StrikeConfig';
import { StrikeService } from '../services/StrikeService';

export class StrikesCache extends IMCache<StrikeConfig[]> {
	@Service() private strikes: StrikeService;

	public async init() {
		// NO-OP
	}

	protected async _get(guildId: string): Promise<StrikeConfig[]> {
		return this.strikes.getStrikeConfigsForGuild(guildId);
	}
}
