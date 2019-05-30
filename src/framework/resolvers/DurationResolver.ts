import moment, { Duration } from 'moment';

import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

const SECONDS_PER_DAY = 86400;

export class DurationResolver extends Resolver {
	public async resolve(value: string, { t }: Context): Promise<Duration> {
		if (typeof value === typeof undefined || value.length === 0) {
			return;
		}

		let seconds = 0;

		const s = parseInt(value, 10);

		if (value.indexOf('s') >= 0) {
			seconds = s;
		} else if (value.indexOf('min') >= 0) {
			seconds = s * 60;
		} else if (value.indexOf('h') >= 0) {
			seconds = s * 3600;
		} else if (value.indexOf('d') >= 0) {
			seconds = s * SECONDS_PER_DAY;
		} else if (value.indexOf('w') >= 0) {
			seconds = s * 7 * SECONDS_PER_DAY;
		} else if (value.indexOf('mo') >= 0) {
			seconds = s * 30 * SECONDS_PER_DAY;
		} else if (value.indexOf('y') >= 0) {
			seconds = s * 365 * SECONDS_PER_DAY;
		} else {
			return moment.duration(value);
		}

		return moment.duration(seconds, 'second');
	}
}
