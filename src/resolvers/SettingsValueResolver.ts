import { IMClient } from '../client';
import { Context } from '../commands/Command';
import {
	InternalSettingsTypes,
	Lang,
	LeaderboardStyle,
	RankAssignmentStyle
} from '../sequelize';

import {
	ArrayResolver,
	BooleanResolver,
	ChannelResolver,
	EnumResolver,
	NumberResolver,
	Resolver,
	RoleResolver,
	StringResolver
} from '.';

export class SettingsValueResolver extends Resolver {
	private types: { [x: string]: InternalSettingsTypes };
	private defaults: { [x: string]: any };

	public constructor(
		client: IMClient,
		types: { [x: string]: InternalSettingsTypes },
		defaults: { [x: string]: any }
	) {
		super(client);

		this.types = types;
		this.defaults = defaults;
	}

	public resolve(value: any, context: Context, [key]: [string]): Promise<any> {
		if (typeof value === typeof undefined || value.length === 0) {
			return;
		}
		if (value === 'none' || value === 'empty' || value === 'null') {
			return null;
		}
		if (value === 'default') {
			return this.defaults[key];
		}

		switch (this.types[key]) {
			case 'Channel':
				return new ChannelResolver(this.client).resolve(value, context);

			case 'Channel[]':
				return new ArrayResolver(this.client, ChannelResolver).resolve(
					value,
					context,
					[key]
				);

			case 'Boolean':
				return new BooleanResolver(this.client).resolve(value, context);

			case 'Number':
				return new NumberResolver(this.client).resolve(value, context);

			case 'Role':
				return new RoleResolver(this.client).resolve(value, context);

			case 'Role[]':
				return new ArrayResolver(this.client, RoleResolver).resolve(
					value,
					context,
					[key]
				);

			case 'String':
				return value;

			case 'String[]':
				return new ArrayResolver(this.client, StringResolver).resolve(
					value,
					context,
					[key]
				);

			case 'Enum<Lang>':
				return new EnumResolver(this.client, Object.values(Lang)).resolve(
					value,
					context
				);

			case 'Enum<LeaderboardStyle>':
				return new EnumResolver(
					this.client,
					Object.values(LeaderboardStyle)
				).resolve(value, context);

			case 'Enum<RankAssignmentStyle>':
				return new EnumResolver(
					this.client,
					Object.values(RankAssignmentStyle)
				).resolve(value, context);

			default:
				return;
		}
	}
}
