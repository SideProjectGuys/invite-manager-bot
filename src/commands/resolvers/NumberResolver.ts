import { Context } from '../Command';
import { Resolver } from '../Resolver';

export class NumberResolver extends Resolver {
	public async resolve(value: string, { guild }: Context): Promise<number> {
		try {
			return parseFloat(value);
		} catch (e) {
			// NO OP
		}
	}
}
