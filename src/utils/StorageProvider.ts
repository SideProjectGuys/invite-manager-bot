import { IStorageProvider, StorageProvider } from 'yamdbf';

import { settings, SettingsKeys } from '../sequelize';

export class IMStorageProvider extends StorageProvider implements IStorageProvider {

	private name: string;
	private cache: { [guildId: string]: string };

	constructor(name: string) {
		super();
		this.name = name;
		this.cache = {};
	}

	public async init() {
		console.log(`${this.name} init`);

		if (this.name !== 'guild_settings') {
			return;
		}

		// Load all settings into initial cache
		const sets = await settings.findAll({
			order: ['guildId', 'key'],
			raw: true,
		});

		const cache: { [x: string]: { [key in SettingsKeys]: string } } = {};
		sets.forEach(set => {
			if (!cache[set.guildId]) {
				cache[set.guildId] = {} as any;
			}
			cache[set.guildId][set.key] = set.value;
		});

		Object.keys(cache).forEach(guildId => {
			const obj = cache[guildId];
			if (!obj[SettingsKeys.prefix]) {
				obj[SettingsKeys.prefix] = '!';
			}
			const str = JSON.stringify(obj);
			this.cache[guildId] = str;
		});
	}

	public async clear() {
		console.log(`${this.name} clear`);

		if (this.name !== 'guild_settings') {
			return;
		}

		this.cache = {};
	}

	public async get(key: string) {
		if (this.name !== 'guild_settings') {
			return '{}';
		}

		if (this.cache[key]) {
			return this.cache[key];
		}

		console.log(`${this.name} get ${key} => missed cache`);

		const sets = await settings.findAll({
			where: {
				guildId: key
			}
		});

		const obj: { [k in SettingsKeys]: string } = {} as any;
		sets.forEach(set => obj[set.key] = set.value);

		if (!obj[SettingsKeys.prefix]) {
			obj[SettingsKeys.prefix] = '!';
		}

		const str = JSON.stringify(obj);
		this.cache[key] = str;
		return str;
	}

	public async set(key: string, value: string) {
		if (this.name !== 'guild_settings') {
			return;
		}

		const changed = value !== this.cache[key];
		this.cache[key] = value;

		if (changed) {
			const config = JSON.parse(value);
			const sets = Object.keys(config).map((k: SettingsKeys) => ({ guildId: key, key: k, value: config[k] }));
			settings.bulkCreate(
				sets,
				{
					updateOnDuplicate: ['value']
				}
			);
		}
	}

	public async keys() {
		if (this.name !== 'guild_settings') {
			return new Promise<string[]>((resolve) => resolve([]));
		}

		return new Promise<string[]>((resolve) => resolve(Object.keys(this.cache)));
	}

	public async remove(key: string) {
		if (this.name !== 'guild_settings') {
			return;
		}

		console.log(`${this.name} remove ${key}`);

		delete this.cache[key];
	}
}
