import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

export class NumberResolver extends Resolver {
	public async resolve(value: string, { t }: Context): Promise<number> {
		if (typeof value === typeof undefined || value.length === 0) {
			return;
		}

		const val = parseFloat(value);
		if (isNaN(val) || !isFinite(val)) {
			throw Error(t('arguments.number.invalid'));
		}
	}
}
