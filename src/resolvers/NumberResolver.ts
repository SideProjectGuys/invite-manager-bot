import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

export class NumberResolver extends Resolver {
	public async resolve(value: string, { guild }: Context): Promise<number> {
		if (typeof value === typeof undefined || value.length === 0) {
			return;
		}

		try {
			return parseFloat(value);
		} catch (e) {
			// NO OP
		}
	}
}
