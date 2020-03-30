import { guildDefaultSettings, guildSettingsInfo, GuildSettingsObject, toDbValue } from '../../settings';
import { GuildSettingsKey } from '../models/GuildSetting';

import { Cache } from './Cache';

export class GuildSettingsCache extends Cache<GuildSettingsObject> {
	public async init() {
		// NO-OP
	}

	protected async _get(guildId: string): Promise<GuildSettingsObject> {
		const set = await this.client.db.getGuildSettings(guildId);
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
			await this.client.db.saveGuildSettings({ guildId, value: set });
		}

		return dbVal;
	}
}
