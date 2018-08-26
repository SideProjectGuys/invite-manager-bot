import { IMClient } from '../client';

import { Context } from './Command';

export interface ResolverConstructor {
	new (client: IMClient): Resolver;
}

export abstract class Resolver {
	protected client: IMClient;

	public constructor(client: IMClient) {
		this.client = client;
	}

	public abstract async resolve(value: any, context: Context): Promise<any>;
}
