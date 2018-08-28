import { IMClient } from '../client';

import { Context } from '../commands/Command';

export interface ResolverConstructor {
	new (client: IMClient, rest?: boolean): Resolver;
}

export abstract class Resolver {
	protected client: IMClient;
	public rest: boolean;

	public constructor(client: IMClient, rest?: boolean) {
		this.client = client;
		this.rest = rest;
	}

	public abstract async resolve(
		value: any,
		context: Context,
		previous: any[]
	): Promise<any>;

	public getHelp(context: Context): string {
		return;
	}
}
