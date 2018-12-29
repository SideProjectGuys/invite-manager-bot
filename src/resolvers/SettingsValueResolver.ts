import { IMClient } from '../client';
import { Context } from '../commands/Command';
import { Lang, LeaderboardStyle, RankAssignmentStyle } from '../sequelize';
import { SettingsInfo } from '../settings';

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
	private infos: { [x: string]: SettingsInfo };

	public constructor(client: IMClient, infos: { [x: string]: SettingsInfo }) {
		super(client);

		this.infos = infos;
	}

	public resolve(value: any, context: Context, [key]: [string]): Promise<any> {
		if (typeof value === typeof undefined || value.length === 0) {
			return;
		}
		if (value === 'none' || value === 'empty' || value === 'null') {
			return null;
		}
		if (value === 'default') {
			return this.infos[key].defaultValue;
		}

		switch (this.infos[key].type) {
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
