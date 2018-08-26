import { Context } from '../Command';
import { Resolver } from '../Resolver';

const truthy = new Set(['true', 'on', 'y', 'yes', 'enable']);
const falsey = new Set(['false', 'off', 'n', 'no', 'disable']);

export class BooleanResolver extends Resolver {
	public async resolve(value: string, { guild }: Context): Promise<boolean> {
		value = value.toLowerCase();
		if (truthy.has(value)) {
			return true;
		}
		if (falsey.has(value)) {
			return false;
		}
	}
}
