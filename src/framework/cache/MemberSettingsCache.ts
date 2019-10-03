import { MemberSettingsKey } from '../../models/MemberSetting';
import { memberDefaultSettings, memberSettingsInfo, MemberSettingsObject, toDbValue } from '../../settings';

import { Cache } from './Cache';

export class MemberSettingsCache extends Cache<Map<string, MemberSettingsObject>> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<Map<string, MemberSettingsObject>> {
		const sets = await this.client.repo.memberSetting.find({ where: { guildId } });

		const map = new Map();
		sets.forEach(set => map.set(set.memberId, { ...memberDefaultSettings, ...set.value }));
		return map;
	}

	public async getOne(guildId: string, memberId: string) {
		const guildSets = await this.get(guildId);
		const set = guildSets.get(memberId);
		return { ...memberDefaultSettings, ...set };
	}

	public async setOne<K extends MemberSettingsKey>(
		guildId: string,
		userId: string,
		key: K,
		value: MemberSettingsObject[K]
	) {
		const guildSet = await this.get(guildId);
		const dbVal = toDbValue(memberSettingsInfo[key], value);

		let set = guildSet.get(userId);
		if (!set) {
			set = { ...memberDefaultSettings };
			guildSet.set(userId, set);
		}

		// Check if the value changed
		if (set[key] !== dbVal) {
			set[key] = dbVal;

			await this.client.repo.memberSetting
				.createQueryBuilder()
				.insert()
				.values({ memberId: userId, guildId, value: set })
				.orUpdate({ overwrite: ['value'] })
				.execute();
		}

		return dbVal;
	}
}
