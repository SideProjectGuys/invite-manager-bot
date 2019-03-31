import { IMClient } from '../../client';
import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

export class EnumResolver extends Resolver {
	private values: Map<string, string>;

	public constructor(client: IMClient, values: string[]) {
		super(client);

		this.values = new Map();
		values.forEach(v => this.values.set(v.toLowerCase(), v));
	}

	public async resolve(value: string, { t }: Context): Promise<string> {
		if (!value) {
			return;
		}

		const val = value.toLowerCase();
		if (this.values.has(val)) {
			return this.values.get(val);
		}
		throw Error(t('arguments.enum.invalid'));
	}

	public getHelp({ t }: Context) {
		const rawVals = [...this.values.values()];

		let i = 0;
		let valText = '';
		while (i < rawVals.length) {
			valText += '`' + rawVals[i] + '`';
			i++;
			if (valText.length > 800) {
				valText += ', ...';
				break;
			} else if (i < rawVals.length) {
				valText += ', ';
			}
		}

		return t('arguments.enum.validValues', {
			values: valText
		});
	}
}
