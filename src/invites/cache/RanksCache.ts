import { Cache } from '../../framework/cache/Cache';
import { RankInstance, ranks } from '../../sequelize';

export class RanksCache extends Cache<RankInstance[]> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<RankInstance[]> {
		return await ranks.findAll({
			where: {
				guildId
			},
			raw: true
		});
	}
}
