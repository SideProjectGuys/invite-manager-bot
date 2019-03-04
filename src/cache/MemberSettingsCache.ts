import {
	memberSettings,
	MemberSettingsInstance,
	MemberSettingsKey,
	sequelize
} from '../sequelize';
import {
	fromDbValue,
	memberDefaultSettings,
	MemberSettingsObject,
	toDbValue
} from '../settings';

import { GuildCache } from './GuildCache';

export class MemberSettingsCache extends GuildCache<
	Map<string, MemberSettingsObject>
> {
	public initOne(guilId: string) {
		return new Map();
	}

	protected async _get(
		guildId: string
	): Promise<Map<string, MemberSettingsObject>> {
		const sets = await memberSettings.findAll({
			where: {
				guildId
			},
			raw: true
		});

		const map = new Map();
		sets.forEach(set => {
			if (set.value === null) {
				return;
			}

			let memberSets = map.get(set.memberId);
			if (!memberSets) {
				memberSets = { ...memberDefaultSettings };
				map.set(set.memberId, memberSets);
			}
			memberSets[set.key] = fromDbValue(set.key, set.value);
		});

		return map;
	}

	public async getOne(guildId: string, memberId: string) {
		const guildSets = await this.get(guildId);
		const set = guildSets.get(memberId);
		return set ? set : { ...memberDefaultSettings };
	}

	public async setOne<K extends MemberSettingsKey>(
		guildId: string,
		userId: string,
		key: K,
		value: MemberSettingsObject[K]
	) {
		const guildSet = await this.get(guildId);
		const dbVal = toDbValue(key, value);
		const val = fromDbValue(key, dbVal);

		let set = guildSet.get(userId);
		if (!set) {
			set = { ...memberDefaultSettings };
		}

		// Check if the value changed
		if (set[key] !== val) {
			memberSettings.bulkCreate(
				[
					{
						id: null,
						memberId: userId,
						guildId,
						key,
						value: dbVal
					}
				],
				{
					updateOnDuplicate: ['value', 'updatedAt']
				}
			);

			set[key] = val;
			guildSet.set(userId, set);
		}

		return val;
	}
}
