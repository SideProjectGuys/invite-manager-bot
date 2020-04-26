import { IMClient } from '../../client';
import { CommandContext } from '../commands/Command';
import { FrameworkModule } from '../FrameworkModule';
import { IMModule } from '../Module';

import { Resolver } from './Resolver';

export class ModuleResolver extends Resolver {
	private modules: Map<string, IMModule>;

	public constructor(client: IMClient) {
		super(client);

		this.modules = new Map();
		for (const module of client.modules.values()) {
			this.modules.set(module.name, module);
		}
	}

	public async resolve(value: string, { guild, t }: CommandContext): Promise<IMModule> {
		if (!value || !guild) {
			return;
		}

		const module = this.modules.get(value.toLowerCase());
		// The framework itself does not count as a module
		if (module instanceof FrameworkModule) {
			return;
		}

		return module;
	}
}
