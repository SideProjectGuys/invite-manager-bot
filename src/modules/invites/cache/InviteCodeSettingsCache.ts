import { Cache } from '../../../framework/cache/Cache';
import { InviteCodeSettingsKey } from '../../../models/InviteCodeSetting';
import {
	inviteCodeDefaultSettings,
	inviteCodeSettingsInfo,
	InviteCodeSettingsObject,
	toDbValue
} from '../../../settings';

export class InviteCodeSettingsCache extends Cache<Map<string, InviteCodeSettingsObject>> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<Map<string, InviteCodeSettingsObject>> {
		const sets = await this.client.repo.inviteCodeSetting.find({ where: { guildId } });

		const map = new Map();
		sets.forEach(set => map.set(set.inviteCode, { ...inviteCodeDefaultSettings, ...set.value }));
		return map;
	}

	public async getOne(guildId: string, invCode: string) {
		const guildSets = await this.get(guildId);
		const set = guildSets.get(invCode);
		return { ...inviteCodeDefaultSettings, ...set };
	}

	public async setOne<K extends InviteCodeSettingsKey>(
		guildId: string,
		inviteCode: string,
		key: K,
		value: InviteCodeSettingsObject[K]
	) {
		const guildSet = await this.get(guildId);
		const dbVal = toDbValue(inviteCodeSettingsInfo[key], value);

		let set = guildSet.get(inviteCode);
		if (!set) {
			set = { ...inviteCodeDefaultSettings };
			guildSet.set(inviteCode, set);
		}

		// Check if the value changed
		if (set[key] !== dbVal) {
			set[key] = dbVal;

			await this.client.repo.inviteCodeSetting
				.createQueryBuilder()
				.insert()
				.values({ inviteCode, guildId, value: set })
				.orUpdate({ columns: ['value'] })
				.execute();
		}

		return dbVal;
	}
}
