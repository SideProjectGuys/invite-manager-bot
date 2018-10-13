/*
import {
	defaultInviteCodeSettings,
	inviteCodeSettings,
	InviteCodeSettingsObject
} from '../sequelize';

import { Cache } from './Cache';

export class InviteCodeSettingsCache extends Cache<InviteCodeSettingsObject> {
	protected initOne(inviteCode: string): InviteCodeSettingsObject {
		return { ...defaultInviteCodeSettings };
	}

	protected async getAll(guildIds: string[]): Promise<void> {
		const sets = await inviteCodeSettings.findAll({
			attributes: ['id', 'key', 'value', 'inviteCode'],
			where: {
				guildId: guildIds
			},
			raw: true
		});

		sets.forEach(set => {
			if (set.value === null) {
				return;
			}
			this.cache.get(set.inviteCode)[set.key] = set.value;
		});
	}

	protected async getOne(
		inviteCode: string
	): Promise<InviteCodeSettingsObject> {
		const sets = await inviteCodeSettings.findAll({
			attributes: ['id', 'key', 'value', 'inviteCode'],
			where: {
				inviteCode
			},
			raw: true
		});

		const obj: InviteCodeSettingsObject = { ...defaultInviteCodeSettings };
		sets.forEach(set => (obj[set.key] = this.fromDbValue(set.key, set.value)));

		return obj;
	}
}
*/
