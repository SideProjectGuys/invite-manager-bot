import {
	defaultInviteCodeSettings,
	inviteCodeSettings,
	InviteCodeSettingsObject
} from '../sequelize';

import { Cache } from './Cache';

export class InviteCodeSettingsCache extends Cache<InviteCodeSettingsObject> {
	public async init() {
		const it = this.client.guilds.keys();

		const guildIds: string[] = [];
		let result = it.next();

		while (!result.done) {
			guildIds.push(result.value as string);
			result = it.next();
		}

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
			let invCode = this.cache.get(set.inviteCode);
			if (!invCode) {
				invCode = {
					name: null,
					roles: []
				};
				this.cache.set(set.inviteCode, invCode);
			}
			invCode[set.key] = this.fromDbValue(set.key, set.value);
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
