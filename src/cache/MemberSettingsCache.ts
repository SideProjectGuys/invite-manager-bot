import { Member, User } from 'eris';

import {
	defaultMemberSettings,
	memberSettings,
	MemberSettingsKey,
	MemberSettingsObject
} from '../sequelize';
import { fromDbValue, toDbValue } from '../settings';

import { Cache } from './Cache';

export class MemberSettingsCache extends Cache<
	Map<string, MemberSettingsObject>
> {
	public async init() {
		const it = this.client.guilds.keys();

		const guildIds: string[] = [];
		let result = it.next();

		while (!result.done) {
			const guildId = result.value as string;
			guildIds.push(guildId);
			this.cache.set(guildId, new Map());
			result = it.next();
		}

		const sets = await memberSettings.findAll({
			where: {
				guildId: guildIds
			},
			raw: true
		});

		sets.forEach(set => {
			if (set.value === null) {
				return;
			}

			const guildSets = this.cache.get(set.guildId);
			let memberSets = guildSets.get(set.memberId);
			if (!memberSets) {
				memberSets = { ...defaultMemberSettings };
				guildSets.set(set.memberId, memberSets);
			}
			memberSets[set.key] = fromDbValue(set.key, set.value);
		});
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

			let guildSets = map.get(set.guildId);
			if (!guildSets) {
				guildSets = new Map();
				map.set(set.guildId, guildSets);
			}

			let memberSets = guildSets.get(set.memberId);
			if (!memberSets) {
				memberSets = { ...defaultMemberSettings };
				guildSets.set(set.memberId, memberSets);
			}
			memberSets[set.key] = fromDbValue(set.key, set.value);
		});

		return map;
	}

	public async getOne(guildId: string, memberId: string) {
		const guildSets = await this.get(guildId);
		const set = guildSets.get(memberId);
		return set ? set : { ...defaultMemberSettings };
	}

	public async setOne<K extends MemberSettingsKey>(
		guildId: string,
		user: User,
		key: K,
		value: MemberSettingsObject[K]
	) {
		const guildSet = await this.get(guildId);
		const dbVal = toDbValue(key, value);
		const val = fromDbValue(key, dbVal);

		let set = guildSet.get(user.id);
		if (!set) {
			set = { ...defaultMemberSettings };
		}

		// Check if the value changed
		if (set[key] !== val) {
			memberSettings.bulkCreate(
				[
					{
						id: null,
						memberId: user.id,
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
			guildSet.set(user.id, set);
		}

		return val;
	}
}
