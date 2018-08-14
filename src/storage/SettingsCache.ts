import moment from 'moment';

import { IMClient } from '../client';
import {
	defaultSettings,
	premiumSubscriptions,
	rolePermissions,
	roles,
	sequelize,
	settings,
	SettingsKey
} from '../sequelize';
import { BotCommand, OwnerCommand } from '../types';

const config = require('../../config.json');

const maxCacheDuration = moment.duration(4, 'h');

export class SettingsCache {
	private static _init: boolean = false;
	private static client: IMClient;

	// Settings
	private static cache: {
		[guildId: string]: { [key in SettingsKey]: any };
	} = {};
	private static cacheFetch: { [guildId: string]: moment.Moment } = {};

	// Role permissions
	private static permsCache: {
		[guildId: string]: { [cmd in BotCommand | OwnerCommand]: string[] };
	} = {};
	private static permsCacheFetch: { [guildId: string]: moment.Moment } = {};

	// Premium
	private static premiumCache: { [guildId: string]: boolean } = {};
	private static premiumCacheFetch: { [guildId: string]: moment.Moment } = {};

	// Init
	public static async init(client: IMClient) {
		this.client = client;
	}

	private static async doInit() {
		const guildIds = this.client.guilds.keyArray();

		// First insert base data for all guilds
		guildIds.forEach(id => {
			this.cache[id] = { ...defaultSettings };
			this.cacheFetch[id] = moment();

			const obj: { [x in BotCommand | OwnerCommand]: string[] } = {} as any;
			Object.values(BotCommand).forEach((k: BotCommand) => (obj[k] = []));
			if (config.ownerGuildIds.indexOf(id) !== -1) {
				Object.values(OwnerCommand).forEach((k: OwnerCommand) => (obj[k] = []));
			}
			this.permsCache[id] = obj;
			this.permsCacheFetch[id] = moment();

			this.premiumCache[id] = false;
			this.premiumCacheFetch[id] = moment();
		});

		// Load all settings into initial cache
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
			this.cache[set.guildId][set.key] = set.value;
		});

		// Load all role permissions
		const perms = await rolePermissions.findAll({
			include: [
				{
					model: roles,
					where: {
						guildId: guildIds
					}
				}
			],
			raw: true
		});

		// Then insert the role permissions we got from the db
		perms.forEach((p: any) => {
			const cmd = p.command as BotCommand | OwnerCommand;
			this.permsCache[p['role.guildId']][cmd].push(p.roleId);
		});

		// Load valid premium subs
		const subs = await premiumSubscriptions.findAll({
			where: {
				guildId: guildIds,
				validUntil: {
					[sequelize.Op.gte]: new Date()
				}
			},
			raw: true
		});

		// Save subs in cache
		subs.forEach(sub => {
			this.premiumCache[sub.guildId] = true;
		});

		this.cache = this.cache;
		this._init = true;
	}

	public static clear() {
		this.cache = {};
	}

	public static async isPremium(guildId: string) {
		if (!this._init) {
			await this.doInit();
		}

		// Check for undefined because our value may be saved as "false" (= no premium)
		if (this.premiumCache[guildId] !== undefined) {
			if (
				this.premiumCacheFetch[guildId] &&
				this.premiumCacheFetch[guildId]
					.clone()
					.add(maxCacheDuration)
					.isAfter(moment())
			) {
				return this.premiumCache[guildId];
			}
		}

		const sub = await premiumSubscriptions.count({
			where: {
				guildId,
				validUntil: {
					[sequelize.Op.gte]: new Date()
				}
			}
		});

		this.premiumCache[guildId] = sub > 0;
		this.premiumCacheFetch[guildId] = moment();

		return this.premiumCache[guildId];
	}

	public static flushPremium(guildId: string) {
		delete this.premiumCache[guildId];
		delete this.premiumCacheFetch[guildId];
	}

	public static async getPermissions(guildId: string) {
		if (!this._init) {
			await this.doInit();
		}

		if (this.permsCache[guildId]) {
			if (
				this.permsCacheFetch[guildId] &&
				this.permsCacheFetch[guildId]
					.clone()
					.add(maxCacheDuration)
					.isAfter(moment())
			) {
				return this.permsCache[guildId];
			}
		}

		const perms = await rolePermissions.findAll({
			include: [
				{
					model: roles,
					where: { guildId }
				}
			],
			raw: true
		});

		const obj: { [x in BotCommand | OwnerCommand]: string[] } = {} as any;
		Object.values(BotCommand).forEach((k: BotCommand) => (obj[k] = []));
		if (config.ownerGuildIds.indexOf(guildId) !== -1) {
			Object.values(OwnerCommand).forEach((k: OwnerCommand) => (obj[k] = []));
		}
		this.permsCache[guildId] = obj;

		perms.forEach((p: any) => {
			const cmd = p.command as BotCommand | OwnerCommand;
			this.permsCache[guildId][cmd].push(p.roleId);
			this.permsCacheFetch[guildId] = moment();
		});

		return this.permsCache[guildId];
	}

	public static flushPermissions(guildId: string) {
		delete this.permsCache[guildId];
		delete this.permsCacheFetch[guildId];
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

	public static flush(guildId: string) {
		delete this.cache[guildId];
		delete this.cacheFetch[guildId];
	}

	public static keys() {
		return Object.keys(this.cache);
	}

	public static remove(guildId: string) {
		delete this.cache[guildId];
	}
}
