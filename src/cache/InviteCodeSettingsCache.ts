import { Invite } from 'eris';

import { inviteCodeSettings, InviteCodeSettingsKey } from '../sequelize';
import {
	fromDbValue,
	inviteCodeDefaultSettings,
	InviteCodeSettingsObject,
	toDbValue
} from '../settings';

import { GuildCache } from './GuildCache';

export class InviteCodeSettingsCache extends GuildCache<
	Map<string, InviteCodeSettingsObject>
> {
	public initOne(guilId: string) {
		return new Map();
	}

	public async getAll(guildIds: string[]) {
		const sets = await inviteCodeSettings.findAll({
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
			let invSets = guildSets.get(set.inviteCode);
			if (!invSets) {
				invSets = { ...inviteCodeDefaultSettings };
				guildSets.set(set.inviteCode, invSets);
			}
			invSets[set.key] = fromDbValue(set.key, set.value);
		});
	}

	protected async _get(
		guildId: string
	): Promise<Map<string, InviteCodeSettingsObject>> {
		const sets = await inviteCodeSettings.findAll({
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

			let invSets = map.get(set.inviteCode);
			if (!invSets) {
				invSets = { ...inviteCodeDefaultSettings };
				map.set(set.inviteCode, invSets);
			}
			invSets[set.key] = fromDbValue(set.key, set.value);
		});

		return map;
	}

	public async getOne(guildId: string, invCode: string) {
		const guildSets = await this.get(guildId);
		const set = guildSets.get(invCode);
		return set ? set : { ...inviteCodeDefaultSettings };
	}

	public async setOne<K extends InviteCodeSettingsKey>(
		invite: Invite,
		key: K,
		value: InviteCodeSettingsObject[K]
	) {
		const guildSet = await this.get(invite.guild.id);
		const dbVal = toDbValue(key, value);
		const val = fromDbValue(key, dbVal);

		let set = guildSet.get(invite.code);
		if (!set) {
			set = { ...inviteCodeDefaultSettings };
		}

		// Check if the value changed
		if (set[key] !== val) {
			inviteCodeSettings.bulkCreate(
				[
					{
						id: null,
						inviteCode: invite.code,
						guildId: invite.guild.id,
						key,
						value: dbVal
					}
				],
				{
					updateOnDuplicate: ['value', 'updatedAt']
				}
			);

			set[key] = val;
			guildSet.set(invite.code, set);
		}

		return val;
	}
}
