import { GuildSettingsKey } from '../../models/GuildSetting';
import { guildDefaultSettings, guildSettingsInfo, GuildSettingsObject, toDbValue } from '../../settings';

import { Cache } from './Cache';

export class SettingsCache extends Cache<GuildSettingsObject> {
	public async init() {
		// TODO
	}

	protected async _get(guildId: string): Promise<GuildSettingsObject> {
		const set = await this.client.repo.setting.findOne({ where: { guildId } });
		return { ...guildDefaultSettings, ...(set ? set.value : null) };
	}

	public async setOne<K extends GuildSettingsKey>(
		guildId: string,
		key: K,
		value: GuildSettingsObject[K]
	): Promise<GuildSettingsObject[K]> {
		const set = await this.get(guildId);
		const dbVal = toDbValue(guildSettingsInfo[key], value);

		// Check if the value changed
		if (set[key] !== dbVal) {
			set[key] = dbVal;

			// Save into DB
			await this.client.repo.setting
				.createQueryBuilder()
				.insert()
				.values({ guildId, value: set })
				.orUpdate({ overwrite: ['value'] })
				.execute();
		}

		return dbVal;
	}
}
