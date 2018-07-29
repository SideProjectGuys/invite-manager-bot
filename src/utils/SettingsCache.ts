import moment from 'moment';

import { IMClient } from '../client';
import {
	defaultSettings,
	premiumSubscriptions,
	sequelize,
	settings,
	SettingsKey
} from '../sequelize';

const maxCacheDuration = moment.duration(4, 'h');

export class SettingsCache {
	private static client: IMClient;
	private static cache: {
		[guildId: string]: { [key in SettingsKey]: any };
	} = {};
	private static cacheFetch: { [guildId: string]: moment.Moment } = {};

	private static _init: boolean = false;
	private static premium: { [guildId: string]: boolean } = {};
	private static premiumFetch: { [guildId: string]: moment.Moment } = {};

	public static async init(client: IMClient) {
		this.client = client;
	}

	private static async doInit() {
		// Load all settings into initial cache
		const sets = await settings.findAll({
			where: {
				guildId: this.client.guilds.keyArray()
			},
			order: ['guildId', 'key'],
			raw: true
		});

		const cache: { [x: string]: { [key in SettingsKey]: string } } = {};
		sets.forEach(set => {
			if (!cache[set.guildId]) {
				cache[set.guildId] = { ...defaultSettings };
			}
			// Skip any empty values that aren't allowed to be empty.
			// This is a backward fix to insert any missing non-empty settings for guilds that don't have them yet.
			if (set.value === null && defaultSettings[set.key] !== null) {
				return;
			}
			cache[set.guildId][set.key] = set.value;
		});

		// Add the dates when the settings where cached, and the default prefix if not set
		Object.keys(cache).forEach(guildId => {
			const obj = cache[guildId];
			if (!obj[SettingsKey.prefix]) {
				obj[SettingsKey.prefix] = '!';
			}
			this.cache[guildId] = obj;
			this.cacheFetch[guildId] = moment();
		});

		// Load valid premium subs
		const subs = await premiumSubscriptions.findAll({
			where: {
				guildId: Object.keys(cache),
				validUntil: {
					[sequelize.Op.gte]: new Date()
				}
			},
			raw: true
		});
		subs.forEach(sub => {
			this.premium[sub.guildId] = true;
			this.premiumFetch[sub.guildId] = moment();
		});

		this.cache = cache;
		this._init = true;
	}

	public static async clear() {
		this.cache = {};
	}

	public static async isPremium(guildId: string) {
		if (!this._init) {
			await this.doInit();
		}

		if (this.premium[guildId]) {
			if (
				this.premiumFetch[guildId] &&
				this.premiumFetch[guildId]
					.clone()
					.add(maxCacheDuration)
					.isAfter(moment())
			) {
				return this.premium[guildId];
			}
		}

		const sub = await premiumSubscriptions.find({
			where: {
				guildId,
				validUntil: {
					[sequelize.Op.gte]: new Date()
				}
			},
			raw: true
		});
		if (sub) {
			this.premium[guildId] = true;
			this.premiumFetch[guildId] = moment();
			return true;
		} else {
			delete this.premium[guildId];
			return false;
		}
	}

	public static async flushPremium(guildId: string) {
		delete this.premium[guildId];
		delete this.premiumFetch[guildId];
	}

	public static async get(guildId: string) {
		if (!this._init) {
			await this.doInit();
		}

		if (this.cache[guildId]) {
			if (
				this.cacheFetch[guildId] &&
				this.cacheFetch[guildId]
					.clone()
					.add(maxCacheDuration)
					.isAfter(moment())
			) {
				return this.cache[guildId];
			}
		}

		const sets = await settings.findAll({ where: { guildId } });

		const obj: { [k in SettingsKey]: string } = { ...defaultSettings };
		sets.forEach(set => (obj[set.key] = set.value));

		this.cache[guildId] = obj;
		this.cacheFetch[guildId] = moment();
		return obj;
	}

	public static async set(guildId: string, key: SettingsKey, value: string) {
		if (!this._init) {
			await this.doInit();
		}

		let oldConfig = this.cache[guildId];
		// Get these settings if we don't have them yet
		if (!oldConfig) {
			oldConfig = await this.get(guildId);
		}

		// Check if the value changed
		if (oldConfig[key] !== value) {
			this.cache[guildId][key] = value;

			// Update the storage provider, so our bot works correctly
			await this.client.storage.guilds.get(guildId).settings.set(key, value);

			await settings.bulkCreate(
				[
					{
						id: null,
						guildId,
						key,
						value
					}
				],
				{
					updateOnDuplicate: ['value', 'updatedAt']
				}
			);
		}
	}

	public static async flush(guildId: string) {
		delete this.cache[guildId];
		delete this.cacheFetch[guildId];
	}

	public static async keys() {
		return Object.keys(this.cache);
	}

	public static async remove(guildId: string) {
		delete this.cache[guildId];
	}
}
