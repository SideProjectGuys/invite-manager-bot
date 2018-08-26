import { IMClient } from '../../client';
import { Context } from '../Command';
import { Resolver } from '../Resolver';

export class EnumResolver extends Resolver {
	private values: string[];

	public constructor(client: IMClient, values: string[]) {
		super(client);

		this.values = values.map(v => v.toLowerCase());
	}

	public async resolve(value: string): Promise<string> {
		const val = value.toLowerCase();
		if (this.values.includes(val)) {
			return val;
		}
	}
}
