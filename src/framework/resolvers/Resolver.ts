import { IMClient } from '../../client';
import { CommandContext } from '../commands/Command';

export interface ResolverConstructor {
	new (client: IMClient): Resolver;
}

export abstract class Resolver {
	protected client: IMClient;

	public constructor(client: IMClient) {
		this.client = client;
	}

	public abstract async resolve(value: any, context: CommandContext, previous: any[]): Promise<any>;

	public getType() {
		return this.constructor.name.replace('Resolver', '').toLowerCase();
	}

	public getHelp(context: CommandContext, previous?: any[]): string {
		return;
	}
}
