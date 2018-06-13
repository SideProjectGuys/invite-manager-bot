import { IStorageProvider, StorageProvider } from '@yamdbf/core';

import { defaultSettings } from '../sequelize';

import { SettingsCache } from './SettingsCache';

const defaultSettingsStr = JSON.stringify(defaultSettings);

export class IMStorageProvider extends StorageProvider
	implements IStorageProvider {
	private name: string;

	public constructor(name: string) {
		super();
		this.name = name;
	}

	public async init() {
		console.log(`INIT ${this.name}`);
	}

	public async clear() {
		//
	}

	public async get(key: string) {
		// console.log('GET: ' + key);

		if (this.name === 'client_storage') {
			if (key === 'defaultGuildSettings') {
				return defaultSettingsStr;
			}
			return '{}';
		}

		if (this.name === 'guild_settings') {
			return JSON.stringify(await SettingsCache.get(key));
		}

		return '{}';
	}

	public async set(key: string, value: string) {
		// console.log('SET: ' + key + ' ' + value);
	}

	public async keys() {
		if (this.name === 'guild_settings') {
			return await SettingsCache.keys();
		}

		return [];
	}

	public async remove(key: string) {
		if (this.name !== 'guild_settings') {
			await SettingsCache.remove(key);
			return;
		}
	}
}
