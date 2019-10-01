import moment, { Duration } from 'moment';

import { IMClient } from '../../client';

export abstract class Cache<CachedObject> {
	protected client: IMClient;

	protected maxCacheDuration: Duration = moment.duration(6, 'h');
	protected cache: Map<string, CachedObject> = new Map();
	protected cacheTime: Map<string, moment.Moment> = new Map();

	private pending: Map<string, Promise<CachedObject>> = new Map();

	// Constructor
	public constructor(client: IMClient) {
		this.client = client;
	}

	public abstract async init(): Promise<void>;

	public async get(key: string): Promise<CachedObject> {
		const cached = this.cache.get(key);

		if (typeof cached !== 'undefined') {
			const time = this.cacheTime.get(key);
			if (time && time.isAfter(moment())) {
				return cached;
			}
		}

		// Check if we're already waiting for this cache update
		const res = this.pending.get(key);
		if (res) {
			return await res;
		}

		// Update the cache, and save it as pending so other requests can use it
		const promise = this._get(key).finally(() => this.pending.delete(key));
		this.pending.set(key, promise);
		const obj = await promise;

		this.cache.set(key, obj);
		this.cacheTime.set(key, moment().add(this.maxCacheDuration));

		return obj;
	}

	protected abstract async _get(key: string): Promise<CachedObject>;

	public async set(key: string, value: CachedObject): Promise<CachedObject> {
		this.cache.set(key, value);
		this.cacheTime.set(key, moment().add(this.maxCacheDuration));
		return value;
	}

	public has(key: string) {
		const time = this.cacheTime.get(key);
		return time && time.isAfter(moment()) && this.cache.has(key);
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
