import { CommandContext } from '../commands/Command';

import { Resolver } from './Resolver';

export class StringResolver extends Resolver {
	public async resolve(value: string, { guild }: CommandContext): Promise<string> {
		return value;
	}
}
