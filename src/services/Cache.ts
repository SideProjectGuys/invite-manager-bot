import { Channel, Role } from 'eris';
import moment from 'moment';

import { IMClient } from '../client';
import {
	defaultSettings,
	premiumSubscriptions,
	rolePermissions,
	roles,
	sequelize,
	settings,
	SettingsKey,
	SettingsObject,
	settingsTypes
} from '../sequelize';
import { BotCommand, ModerationCommand, OwnerCommand } from '../types';

const config = require('../../config.json');

const maxCacheDuration = moment.duration(4, 'h');

type PermissionsObject = {
	[key in BotCommand | OwnerCommand | ModerationCommand]: string[]
};

export class Cache {
	private client: IMClient;

	// Settings
	private cache: Map<string, SettingsObject> = new Map();
	private cacheFetch: Map<string, moment.Moment> = new Map();

	// Role permissions
	private permsCache: Map<string, PermissionsObject> = new Map();
	private permsCacheFetch: Map<string, moment.Moment> = new Map();

	// Premium
	private premiumCache: Map<string, boolean> = new Map();
	private premiumCacheFetch: Map<string, moment.Moment> = new Map();

	// Constructor
	public constructor(client: IMClient) {
		this.client = client;
	}

	// Init
	public async init() {
		const it = this.client.guilds.keys();

		const guildIds: string[] = [];
		let result = it.next();

		while (!result.done) {
			const id = result.value as string;
			guildIds.push(id);

			this.cache.set(id, { ...defaultSettings });
			this.cacheFetch.set(id, moment());

			// Create permissions map
			const obj: PermissionsObject = {} as any;
			Object.values(BotCommand).forEach((k: BotCommand) => (obj[k] = []));
			if (config.ownerGuildIds.indexOf(id) !== -1) {
				Object.values(OwnerCommand).forEach((k: OwnerCommand) => (obj[k] = []));
			}
			this.permsCache.set(id, obj);
			this.permsCacheFetch.set(id, moment());

			this.premiumCache.set(id, false);
			this.premiumCacheFetch.set(id, moment());

			result = it.next();
		}

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
			this.permsCache.get(p['role.guildId'])[cmd].push(p.roleId);
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
			this.premiumCache.set(sub.guildId, true);
		});
	}

	public clear() {
		this.cache = new Map();
	}

	public async isPremium(guildId: string) {
		const cached = this.premiumCache.get(guildId);

		if (cached !== undefined) {
			const time = this.premiumCacheFetch.get(guildId);
			if (
				time &&
				time
					.clone()
					.add(maxCacheDuration)
					.isAfter(moment())
			) {
				return cached;
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

		const perm = sub > 0;
		this.premiumCache.set(guildId, perm);
		this.premiumCacheFetch.set(guildId, moment());

		return perm;
	}

	public flushPremium(guildId: string) {
		this.premiumCache.delete(guildId);
		this.premiumCacheFetch.delete(guildId);
	}

	public async getPermissions(guildId: string) {
		const cached = this.permsCache.get(guildId);

		if (cached !== undefined) {
			const time = this.permsCacheFetch.get(guildId);
			if (
				time &&
				time
					.clone()
					.add(maxCacheDuration)
					.isAfter(moment())
			) {
				return cached;
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

		const obj: PermissionsObject = {} as any;
		Object.values(BotCommand).forEach((k: BotCommand) => (obj[k] = []));
		if (config.ownerGuildIds.indexOf(guildId) !== -1) {
			Object.values(OwnerCommand).forEach((k: OwnerCommand) => (obj[k] = []));
		}

		perms.forEach((p: any) => {
			const cmd = p.command as BotCommand | OwnerCommand;
			obj[cmd].push(p.roleId);
		});

		this.permsCache.set(guildId, obj);
		this.permsCacheFetch.set(guildId, moment());

		return obj;
	}

	public flushPermissions(guildId: string) {
		this.permsCache.delete(guildId);
		this.permsCacheFetch.delete(guildId);
	}

	public async get(guildId: string) {
		const cached = this.cache.get(guildId);

		if (cached !== undefined) {
			const time = this.cacheFetch.get(guildId);
			if (
				time &&
				time
					.clone()
					.add(maxCacheDuration)
					.isAfter(moment())
			) {
				return cached;
			}
		}

		const sets = await settings.findAll({ where: { guildId } });

		const obj: SettingsObject = { ...defaultSettings };
		sets.forEach(set => (obj[set.key] = this.fromDbValue(set.key, set.value)));

		this.cache.set(guildId, obj);
		this.cacheFetch.set(guildId, moment());

		return obj;
	}

	public async set(guildId: string, key: SettingsKey, value: any) {
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
			return value;
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

	public flush(guildId: string) {
		this.cache.delete(guildId);
		this.cacheFetch.delete(guildId);
	}
}
