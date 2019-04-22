import { IMClient } from '../client';
import { Context } from '../commands/Command';

export interface ResolverConstructor {
	new (client: IMClient): Resolver;
}

export abstract class Resolver {
	protected client: IMClient;

	public constructor(client: IMClient) {
		this.client = client;
	}

	public abstract async resolve(
		value: any,
		context: Context,
		previous: any[]
	): Promise<any>;

	public getHelp(context: Context, previous?: any[]): string {
		return;
	}

	public getType(): string {
		return '';
	}

	public getExamples(rest: boolean): string[] {
		return [];
	}
}
