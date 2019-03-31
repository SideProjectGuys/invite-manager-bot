import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

export class StringResolver extends Resolver {
	public async resolve(value: string, { guild }: Context): Promise<string> {
		return value;
	}
}
