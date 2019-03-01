import moment, { Moment } from 'moment';

import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

export class DateResolver extends Resolver {
	public async resolve(value: string, { t }: Context): Promise<Moment> {
		if (typeof value === typeof undefined || value.length === 0) {
			return;
		}

		return moment(value);
	}
}
