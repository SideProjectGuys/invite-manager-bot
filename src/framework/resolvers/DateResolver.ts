import moment, { Moment } from 'moment';

import { CommandContext } from '../commands/Command';

import { Resolver } from './Resolver';

export class DateResolver extends Resolver {
	public async resolve(value: string, { t }: CommandContext): Promise<Moment> {
		if (typeof value === typeof undefined || value.length === 0) {
			return;
		}

		return moment(value);
	}
}
