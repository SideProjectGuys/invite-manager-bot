import { IMClient } from '../client';
import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

export class EnumResolver extends Resolver {
	private values: string[];

	public constructor(client: IMClient, values: string[]) {
		super(client);

		this.values = values.map(v => v.toLowerCase());
	}

	public async resolve(value: string, { t }: Context): Promise<string> {
		if (!value) {
			return;
		}

		const val = value.toLowerCase();
		if (this.values.includes(val)) {
			return val;
		}
	}

	public getHelp({ t }: Context) {
		return t('arguments.enum.validValues', {
			values: this.values.map(v => '`' + v + '`').join(', ')
		});
	}
}
