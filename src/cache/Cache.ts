import moment from 'moment';

import { IMClient } from '../client';

const maxCacheDuration = moment.duration(4, 'h');

export abstract class Cache<CachedObject> {
	protected client: IMClient;

	// Role permissions
	protected cache: Map<string, CachedObject> = new Map();
	protected cacheTime: Map<string, moment.Moment> = new Map();

	// Constructor
	public constructor(client: IMClient) {
		this.client = client;
	}

	public async init() {
		const it = this.client.guilds.keys();

		const guildIds: string[] = [];
		let result = it.next();

		while (!result.done) {
			const id = result.value as string;
			guildIds.push(id);

			this.cache.set(id, this.initOne(id));
			this.cacheTime.set(id, moment());

			result = it.next();
		}

		await this.getAll(guildIds);
	}

	protected abstract initOne(guildId: string): CachedObject;
	protected abstract async getAll(guildIds: string[]): Promise<void>;

	public async get(guildId: string): Promise<CachedObject> {
		const cached = this.cache.get(guildId);

		if (cached !== undefined) {
			const time = this.cacheTime.get(guildId);
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

		const obj = await this.getOne(guildId);

		this.cache.set(guildId, obj);
		this.cacheTime.set(guildId, moment());

		return obj;
	}

	protected abstract async getOne(guildId: string): Promise<CachedObject>;

	public async set(
		guildId: string,
		value: CachedObject
	): Promise<CachedObject> {
		this.cache.set(guildId, value);
		this.cacheTime.set(guildId, moment());
		return value;
	}

	public flush(guildId: string) {
		this.cache.delete(guildId);
		this.cacheTime.delete(guildId);
	}

	public clear() {
		this.cache = new Map();
		this.cacheTime = new Map();
	}
}
