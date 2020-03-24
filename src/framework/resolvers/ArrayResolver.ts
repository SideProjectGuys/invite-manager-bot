import { IMClient } from '../../client';
import { Context } from '../commands/Command';

import { Resolver, ResolverConstructor } from './Resolver';

export class ArrayResolver extends Resolver {
	private resolver: Resolver;

	public constructor(client: IMClient, resolver: Resolver | ResolverConstructor) {
		super(client);

		if (resolver instanceof Resolver) {
			this.resolver = resolver;
		} else {
			this.resolver = new resolver(client);
		}
	}

	public async resolve(value: string, context: Context, previous: any[]): Promise<any[]> {
		if (!value) {
			return;
		}

		const rawSplits = value.split(/[,\s]/);

		const splits: string[] = [];
		let quote = false;
		let acc = '';
		for (let j = 0; j < rawSplits.length; j++) {
			const split = rawSplits[j];
			if (!split.length) {
				continue;
			}

			if (split.startsWith(`"`)) {
				quote = true;
				acc = '';
			}

			if (split.endsWith(`"`)) {
				quote = false;
				acc += ' ' + split.substring(0, split.length - 1);
				splits.push(acc.substring(2));
				continue;
			}

			if (quote) {
				acc += ' ' + split;
			} else {
				splits.push(split);
			}
		}

		return await Promise.all(splits.map((s) => this.resolver.resolve(s, context, previous)));
	}
}
