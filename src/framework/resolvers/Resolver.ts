import { IMClient } from '../../client';
import { Context } from '../commands/Command';

export interface ResolverConstructor {
	new (client: IMClient): Resolver;
}

export abstract class Resolver {
	protected client: IMClient;

	public constructor(client: IMClient) {
		this.client = client;
	}

	public abstract async resolve(value: any, context: Context, previous: any[]): Promise<any>;

	public getType() {
		return this.constructor.name.replace('Resolver', '').toLowerCase();
	}

	public getHelp(context: Context, previous?: any[]): string {
		return;
	}
}
