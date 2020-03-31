import { IMClient } from '../../client';
import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

export class EnumResolver extends Resolver {
	private values: Map<string, string>;

	public constructor(client: IMClient, values: string[]) {
		super(client);

		this.values = new Map();
		values.forEach((v) => this.values.set(v.toLowerCase(), v));
	}

	public async resolve(value: string, { t }: Context): Promise<string> {
		if (!value) {
			return;
		}

		const val = value.toLowerCase();
		if (this.values.has(val)) {
			return this.values.get(val);
		}
		throw Error(t(`resolvers.${this.getType()}.invalid`));
	}

	public getHelp({ t }: Context) {
		return t(`resolvers.${this.getType()}.validValues`, {
			values: [...this.values.values()]
				.sort((a, b) => a.localeCompare(b))
				.map((v) => '`' + v + '`')
				.join(', ')
		});
	}
}
