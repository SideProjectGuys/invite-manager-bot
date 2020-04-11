import { IMClient } from '../client';

import { IMCache } from './cache/Cache';
import { IMService } from './services/Service';

export abstract class IMModule {
	protected client: IMClient;

	public constructor(client: IMClient) {
		this.client = client;
	}

	public async init() {
		// NO-OP
	}

	protected registerService<T extends IMService>(service: new (client: IMClient) => T) {
		return this.client.registerService(service);
	}
	protected registerCache<P extends any, T extends IMCache<P>>(cache: new (client: IMClient) => T) {
		return this.client.registerCache(cache);
	}
}
