import { inviteCodeSettings, InviteCodeSettingsKey } from '../sequelize';
import {
	fromDbValue,
	inviteCodeDefaultSettings,
	InviteCodeSettingsObject,
	toDbValue
} from '../settings';

import { Cache } from './Cache';

export class InviteCodeSettingsCache extends Cache<InviteCodeSettingsObject> {
	private guildToCodeMap: Map<string, Set<string>> = new Map();
	private codeToGuildMap: Map<string, string> = new Map();

	public async init() {
		const it = this.client.guilds.keys();

		const guildIds: string[] = [];
		let result = it.next();

		while (!result.done) {
			const guildId = result.value as string;
			guildIds.push(guildId);
			this.guildToCodeMap.set(guildId, new Set());
			result = it.next();
		}

		const sets = await inviteCodeSettings.findAll({
			attributes: ['id', 'guildId', 'key', 'value', 'inviteCode'],
			where: {
				guildId: guildIds
			},
			raw: true
		});

		sets.forEach(set => {
			if (set.value === null) {
				return;
			}
			this.guildToCodeMap.get(set.guildId).add(set.inviteCode);
			this.codeToGuildMap.set(set.inviteCode, set.guildId);

			let invCode = this.cache.get(set.inviteCode);
			if (!invCode) {
				invCode = {
					name: null,
					roles: []
				};
				this.cache.set(set.inviteCode, invCode);
			}
			invCode[set.key] = fromDbValue(set.key, set.value);
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

		const obj: InviteCodeSettingsObject = { ...inviteCodeDefaultSettings };
		sets.forEach(set => (obj[set.key] = fromDbValue(set.key, set.value)));

		return obj;
	}

	public async getByGuild(guildId: string) {
		const allCodes: Map<string, InviteCodeSettingsObject> = new Map();
		await Promise.all(
			[...this.guildToCodeMap.get(guildId)].map(code => {
				return new Promise<void>(resolve => {
					this.get(code).then(set => {
						allCodes.set(code, set);
						resolve();
					});
				});
			})
		);
		return allCodes;
	}

	public async setOne<K extends InviteCodeSettingsKey>(
		inviteCode: string,
		key: K,
		value: InviteCodeSettingsObject[K]
	) {
		const cfg = await this.get(inviteCode);
		const dbVal = toDbValue(key, value);
		const val = fromDbValue(key, dbVal);

		// Check if the value changed
		if (cfg[key] !== val) {
			inviteCodeSettings.bulkCreate(
				[
					{
						id: null,
						inviteCode,
						guildId: this.codeToGuildMap.get(inviteCode),
						key,
						value: dbVal
					}
				],
				{
					updateOnDuplicate: ['value', 'updatedAt']
				}
			);

			cfg[key] = val;
			this.cache.set(inviteCode, cfg);
		}

		return val;
	}
}
