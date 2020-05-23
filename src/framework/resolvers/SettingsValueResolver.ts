import { IMClient } from '../../client';
import { SettingsInfo } from '../../types';
import { CommandContext } from '../commands/Command';
import { Service } from '../decorators/Service';
import { SettingsBaseTypeConstructor } from '../decorators/Setting';
import { SettingsService } from '../services/Settings';

import {
	ArrayResolver,
	BooleanResolver,
	ChannelResolver,
	DateResolver,
	EnumResolver,
	NumberResolver,
	Resolver,
	RoleResolver,
	StringResolver
} from '.';

export class SettingsValueResolver extends Resolver {
	@Service() private settings: SettingsService;

	private baseType: SettingsBaseTypeConstructor;
	private infos: Map<string, SettingsInfo<any>>;
	private resolvers: Map<string, Resolver>;

	public constructor(client: IMClient, baseClass: SettingsBaseTypeConstructor) {
		super(client);

		this.resolvers = new Map();
		this.baseType = baseClass;

		this.resolvers.set('Boolean', new BooleanResolver(client));
		this.resolvers.set('Number', new NumberResolver(client));
		this.resolvers.set('Date', new DateResolver(client));
		this.resolvers.set('String', new StringResolver(client));
		this.resolvers.set('String[]', new ArrayResolver(client, StringResolver));

		this.resolvers.set('Channel', new ChannelResolver(client));
		this.resolvers.set('Channel[]', new ArrayResolver(client, ChannelResolver));
		this.resolvers.set('Role', new ChannelResolver(client));
		this.resolvers.set('Role[]', new ArrayResolver(client, RoleResolver));
	}

	private getInfo(key: string) {
		if (!this.infos) {
			this.infos = this.settings.getSettingsInfos(this.baseType);
		}

		return this.infos.get(key);
	}

	public resolve(value: any, context: CommandContext, [key]: [string]): Promise<any> {
		if (typeof value === typeof undefined || value.length === 0) {
			return;
		}
		if (value === 'none' || value === 'empty' || value === 'null') {
			return null;
		}

		const info = this.getInfo(key);
		if (value === 'default') {
			return info.defaultValue;
		}

		const resolver = this.getResolver(key, info);
		return resolver.resolve(value, context, [key]);
	}

	public getHelp(context: CommandContext, args?: [string]): string {
		if (args && args.length > 0) {
			const key = args[0];
			return this.getResolver(key, this.getInfo(key)).getHelp(context, [key]);
		}
		return super.getHelp(context);
	}

	private getResolver(key: string, info: SettingsInfo<any>) {
		let type: string = info.type;
		if (type === 'Enum') {
			type = `Enum<${key}>`;
		} else if (type === 'Enum[]') {
			type = `Enum<${key}>[]`;
		}

		let resolver = this.resolvers.get(type);
		if (!resolver) {
			if (!info.enumValues) {
				throw new Error('Missing enum values for resolver: ' + key);
			}

			resolver = new EnumResolver(
				this.client,
				typeof info.enumValues === 'function' ? info.enumValues() : info.enumValues
			);
			this.resolvers.set(type, resolver);
		}
		return resolver;
	}
}
