import { SettingsKey } from '../../models/Setting';
import { defaultSettings, settingsInfo, SettingsObject, toDbValue } from '../../settings';

import { Cache } from './Cache';

export class SettingsCache extends Cache<SettingsObject> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<SettingsObject> {
		const set = await this.client.repo.setting.findOne({ where: { guildId } });
		return { ...defaultSettings, ...(set ? set.value : null) };
	}

	public async setOne<K extends SettingsKey>(
		guildId: string,
		key: K,
		value: SettingsObject[K]
	): Promise<SettingsObject[K]> {
		const set = await this.get(guildId);
		const dbVal = toDbValue(settingsInfo[key], value);

		// Check if the value changed
		if (set[key] !== dbVal) {
			set[key] = dbVal;

			// Save into DB
			await this.client.repo.setting
				.createQueryBuilder()
				.insert()
				.values({ guildId, value: set })
				.orUpdate({ columns: ['value'] })
				.execute();
		}

		return dbVal;
	}
}
