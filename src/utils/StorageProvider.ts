import { IStorageProvider, StorageProvider } from 'yamdbf';

import { settings, SettingsKey } from '../sequelize';

const defaultSettings: { [k in SettingsKey]: string } = {
	prefix: '!',
	lang: 'en_us',
	joinMessage: null,
	joinMessageChannel: null,
	leaveMessage: null,
	leaveMessageChannel: null,
	modRole: null,
	modChannel: null,
	logChannel: null,
	getUpdates: 'true'
};
const defaultSettingsStr = JSON.stringify(defaultSettings);

export class IMStorageProvider extends StorageProvider implements IStorageProvider {
	private name: string;
	private cache: { [guildId: string]: string };

	public constructor(name: string) {
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
				raw: true
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
	}

	public async clear() {
		if (this.name === 'guild_settings') {
			this.cache = {};
			return;
		}
	}

	public async get(key: string) {
		if (this.name === 'client_storage') {
			if (key === 'defaultGuildSettings') {
				return defaultSettingsStr;
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

			const obj: { [k in SettingsKey]: string } = defaultSettings;
			sets.forEach(set => (obj[set.key] = set.value));

			const str = JSON.stringify(obj);
			this.cache[key] = str;
			return str;
		}

		return '{}';
	}

	public async set(key: string, value: string) {
		if (this.name === 'guild_settings') {
			// Check if the value changed
			if (value !== this.cache[key]) {
				const oldConfig = JSON.parse(this.cache[key]);
				const config = { ...defaultSettings, ...JSON.parse(value) };

				this.cache[key] = JSON.stringify(config);

				// Filter out valid configs, and only the ones that changed
				const sets = Object.keys(config)
					.filter(k => k in SettingsKey && config[k] !== oldConfig[k])
					.map((k: SettingsKey) => ({ guildId: key, key: k, value: config[k] }));

				settings.bulkCreate(sets, {
					updateOnDuplicate: ['value', 'updatedAt']
				});
			}
			return;
		}
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
	}
}
