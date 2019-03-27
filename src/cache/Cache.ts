import moment from 'moment';

import { IMClient } from '../client';

const maxCacheDuration = moment.duration(6, 'h');

export abstract class Cache<CachedObject> {
	protected client: IMClient;

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
			if (time && time.isAfter(moment())) {
				return cached;
			}
		}

		const obj = await this._get(key);

		this.cache.set(key, obj);
		this.cacheTime.set(key, moment().add(maxCacheDuration));

		return obj;
	}

	protected abstract async _get(key: string): Promise<CachedObject>;

	public async set(key: string, value: CachedObject): Promise<CachedObject> {
		this.cache.set(key, value);
		this.cacheTime.set(key, moment().add(maxCacheDuration));
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
}
