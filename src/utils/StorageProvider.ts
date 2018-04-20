import { IStorageProvider, StorageProvider } from 'yamdbf';

import { settings, SettingsKey } from '../sequelize';

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

		if (this.name === 'guild_settings') {
			// Load all settings into initial cache
			const sets = await settings.findAll({
				order: ['guildId', 'key'],
				raw: true,
			});

			const cache: { [x: string]: { [key in SettingsKey]: string } } = {};
			sets.forEach(set => {
				if (!cache[set.guildId]) {
					cache[set.guildId] = {} as any;
				}
				cache[set.guildId][set.key] = set.value;
			});

			Object.keys(cache).forEach(guildId => {
				const obj = cache[guildId];
				if (!obj[SettingsKey.prefix]) {
					obj[SettingsKey.prefix] = '!';
				}
				const str = JSON.stringify(obj);
				this.cache[guildId] = str;
			});
			return;
		}

		return;
	}

	public async clear() {
		if (this.name === 'guild_settings') {
			this.cache = {};
			return;
		}

		return;
	}

	public async get(key: string) {
		if (this.name === 'client_storage') {
			if (key === 'defaultGuildSettings') {
				return '{"prefix":"!","lang":"en"}';
			}
			return '{}';
		}

		if (this.name === 'guild_settings') {
			if (this.cache[key]) {
				return this.cache[key];
			}

			const sets = await settings.findAll({
				where: {
					guildId: key
				}
			});

			const obj: { [k in SettingsKey]: string } = {} as any;
			sets.forEach(set => obj[set.key] = set.value);

			if (!obj[SettingsKey.prefix]) {
				obj[SettingsKey.prefix] = '!';
			}

			const str = JSON.stringify(obj);
			this.cache[key] = str;
			return str;
		}

		return '{}';
	}

	public async set(key: string, value: string) {
		if (this.name === 'guild_settings') {
			const changed = value !== this.cache[key];
			this.cache[key] = value;

			if (changed) {
				const config = JSON.parse(value);
				const sets = Object.keys(config)
					.filter(k => k in SettingsKey)
					.map((k: SettingsKey) => ({ guildId: key, key: k, value: config[k] }));
				settings.bulkCreate(
					sets,
					{
						updateOnDuplicate: ['value']
					}
				);
			}
			return;
		}

		return;
	}

	public async keys() {
		if (this.name === 'guild_settings') {
			return Object.keys(this.cache);
		}

		return [];
	}

	public async remove(key: string) {
		if (this.name !== 'guild_settings') {
			delete this.cache[key];
			return;
		}

		return;
	}
}
