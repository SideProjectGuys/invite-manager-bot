import { Channel, Role } from 'eris';

import {
	defaultSettings,
	settings,
	SettingsKey,
	SettingsObject,
	settingsTypes
} from '../sequelize';

import { Cache } from './Cache';

export class SettingsCache extends Cache<SettingsObject> {
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
			this.cache.get(set.guildId)[set.key] = this.fromDbValue(
				set.key,
				set.value
			);
		});
	}

	protected async getOne(guildId: string): Promise<SettingsObject> {
		const sets = await settings.findAll({ where: { guildId } });

		const obj: SettingsObject = { ...defaultSettings };
		sets.forEach(set => (obj[set.key] = this.fromDbValue(set.key, set.value)));

		return obj;
	}

	public async setOne(guildId: string, key: SettingsKey, value: any) {
		const cfg = await this.get(guildId);
		const dbVal = this.toDbValue(key, value);
		const val = this.fromDbValue(key, dbVal);

		// Check if the value changed
		if (cfg[key] !== val) {
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

	private toDbValue(key: SettingsKey, value: any): string {
		const type = settingsTypes[key];

		if (value === 'default') {
			return this._toDbValue(type, defaultSettings[key]);
		}

		return this._toDbValue(type, value);
	}
	private _toDbValue(type: string, value: any): string {
		if (value === 'none' || value === 'empty' || value === 'null') {
			return null;
		}

		if (type === 'Channel') {
			if (typeof value === 'string') {
				return value;
			} else {
				return (value as Channel).id;
			}
		} else if (type === 'Role') {
			if (typeof value === 'string') {
				return value;
			} else {
				return (value as Role).id;
			}
		} else if (type === 'Boolean') {
			return value ? 'true' : 'false';
		} else if (type.endsWith('[]')) {
			const subType = type.substring(0, type.length - 2);
			return value.map((v: any) => this._toDbValue(subType, v)).join(',');
		}

		return value;
	}

	private fromDbValue(key: SettingsKey, value: string): any {
		const type = settingsTypes[key];
		return this._fromDbValue(type, value);
	}
	private _fromDbValue(type: string, value: string): any {
		if (value === undefined || value === null) {
			return null;
		}

		if (type === 'Boolean') {
			return value === 'true';
		} else if (type === 'Number') {
			return parseInt(value, 10);
		} else if (type.endsWith('[]')) {
			const subType = type.substring(0, type.length - 2);
			const splits = value.split(',');
			return splits.map(s => this._fromDbValue(subType, s)) as
				| string[]
				| number[]
				| boolean[];
		}

		return value;
	}
}
