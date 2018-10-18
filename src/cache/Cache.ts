import { Channel, Role } from 'eris';
import moment from 'moment';

import { IMClient } from '../client';
import {
	defaultInviteCodeSettings,
	defaultMemberSettings,
	defaultSettings,
	InviteCodeSettingsKey,
	inviteCodeSettingsTypes,
	MemberSettingsKey,
	memberSettingsTypes,
	SettingsKey,
	settingsTypes
} from '../sequelize';

const maxCacheDuration = moment.duration(4, 'h');

type AllKeys = SettingsKey | MemberSettingsKey | InviteCodeSettingsKey;
const allSettingsTypes = {
	...settingsTypes,
	...memberSettingsTypes,
	...inviteCodeSettingsTypes
};
const allDefaultSettings = {
	...defaultSettings,
	...defaultMemberSettings,
	...defaultInviteCodeSettings
};

export abstract class Cache<CachedObject> {
	protected client: IMClient;

	// Role permissions
	protected cache: Map<string, CachedObject> = new Map();
	protected cacheTime: Map<string, moment.Moment> = new Map();

	// Constructor
	public constructor(client: IMClient) {
		this.client = client;
	}

	public abstract async init(): Promise<void>;

	public async get(key: string): Promise<CachedObject> {
		const cached = this.cache.get(key);

		if (cached !== undefined) {
			const time = this.cacheTime.get(key);
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

		const obj = await this.getOne(key);

		this.cache.set(key, obj);
		this.cacheTime.set(key, moment());

		return obj;
	}

	protected abstract async getOne(key: string): Promise<CachedObject>;

	public async set(key: string, value: CachedObject): Promise<CachedObject> {
		this.cache.set(key, value);
		this.cacheTime.set(key, moment());
		return value;
	}

	public flush(key: string) {
		this.cache.delete(key);
		this.cacheTime.delete(key);
	}

	public clear() {
		this.cache = new Map();
		this.cacheTime = new Map();
	}

	public getSize() {
		return this.cache.size;
	}

	protected toDbValue<K extends AllKeys>(key: K, value: any): string {
		const type = allSettingsTypes[key];

		if (value === 'default') {
			return this._toDbValue(type, allDefaultSettings[key]);
		}

		return this._toDbValue(type, value);
	}
	protected _toDbValue(type: string, value: any): string {
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

	protected fromDbValue<K extends AllKeys>(key: K, value: string): any {
		const type = allSettingsTypes[key];
		return this._fromDbValue(type, value);
	}
	protected _fromDbValue(type: string, value: string): any {
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
