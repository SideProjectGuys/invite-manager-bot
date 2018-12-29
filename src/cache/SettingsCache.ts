import { settings, SettingsKey } from '../sequelize';
import {
	defaultSettings,
	fromDbValue,
	SettingsObject,
	toDbValue
} from '../settings';

import { GuildCache } from './GuildCache';

export class SettingsCache extends GuildCache<SettingsObject> {
	protected initOne(guildId: string): SettingsObject {
		return { ...defaultSettings };
	}

	protected async getAll(guildIds: string[]): Promise<void> {
		// Load all settings from DB
		const sets = await settings.findAll({
			where: {
				guildId: guildIds
			},
			raw: true
		});

		// Then insert the settings we got from the DB
		sets.forEach(set => {
			// Skip any empty values that aren't allowed to be empty.
			// This is a backward fix to insert any missing non-empty settings
			// for guilds that don't have them yet.
			if (set.value === null && defaultSettings[set.key] !== null) {
				return;
			}
			this.cache.get(set.guildId)[set.key] = fromDbValue(set.key, set.value);
		});
	}

	protected async _get(guildId: string): Promise<SettingsObject> {
		const sets = await settings.findAll({ where: { guildId } });

		const obj: SettingsObject = { ...defaultSettings };
		sets.forEach(set => (obj[set.key] = fromDbValue(set.key, set.value)));

		return obj;
	}

	public async setOne<K extends SettingsKey>(
		guildId: string,
		key: K,
		value: SettingsObject[K]
	): Promise<SettingsObject[K]> {
		const cfg = await this.get(guildId);
		const dbVal = toDbValue(key, value);
		const val = fromDbValue(key, dbVal);

		// Check if the value changed
		if (cfg[key] !== val) {
			// Save into DB
			settings.bulkCreate(
				[
					{
						id: null,
						guildId,
						key,
						value: dbVal
					}
				],
				{
					updateOnDuplicate: ['value', 'updatedAt']
				}
			);

			cfg[key] = val;
			this.cache.set(guildId, cfg);
		}

		return val;
	}
}
