import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

export class StringResolver extends Resolver {
	public async resolve(value: string, { guild }: Context): Promise<string> {
		return value;
	}

	public getType() {
		return 'Text';
	}

	public getExamples(rest: boolean): string[] {
		return [`Text`, rest ? 'Text with a space' : '"Text with a space"'];
	}
}
