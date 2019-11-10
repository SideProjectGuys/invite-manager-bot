import { IMClient } from '../../client';
import { InternalSettingsTypes, SettingsInfo } from '../../settings';
import { MusicPlatformType } from '../../types';
import { Context } from '../commands/Command';
import { ActivityStatus, ActivityType } from '../models/BotSetting';
import { AnnouncementVoice, Lang, LeaderboardStyle, RankAssignmentStyle } from '../models/GuildSetting';

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
	private infos: { [key: string]: SettingsInfo<any> };
	private resolvers: { [key in InternalSettingsTypes]: Resolver };

	public constructor(client: IMClient, infos: { [x: string]: SettingsInfo<any> }) {
		super(client);

		this.infos = infos;
		this.resolvers = {
			Channel: new ChannelResolver(client),
			'Channel[]': new ArrayResolver(client, ChannelResolver),
			Boolean: new BooleanResolver(client),
			Number: new NumberResolver(client),
			Date: new DateResolver(client),
			Role: new RoleResolver(client),
			'Role[]': new ArrayResolver(client, RoleResolver),
			String: new StringResolver(client),
			'String[]': new ArrayResolver(client, StringResolver),
			'Enum<Lang>': new EnumResolver(client, Object.values(Lang)),
			'Enum<LeaderboardStyle>': new EnumResolver(client, Object.values(LeaderboardStyle)),
			'Enum<RankAssignmentStyle>': new EnumResolver(client, Object.values(RankAssignmentStyle)),
			'Enum<AnnouncementVoice>': new EnumResolver(client, Object.values(AnnouncementVoice)),
			'Enum<ActivityType>': new EnumResolver(client, Object.values(ActivityType)),
			'Enum<ActivityStatus>': new EnumResolver(client, Object.values(ActivityStatus)),
			'Enum<MusicPlatformTypes>': new EnumResolver(client, Object.values(MusicPlatformType)),
			'Enum<MusicPlatformTypes>[]': new ArrayResolver(
				client,
				new EnumResolver(client, Object.values(MusicPlatformType))
			)
		};
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

		const resolver = this.resolvers[this.infos[key].type];
		return resolver.resolve(value, context, [key]);
	}

	public getHelp(context: Context, args?: [string]): string {
		if (args && args.length > 0) {
			const key = args[0];
			return this.resolvers[this.infos[key].type].getHelp(context, [key]);
		}
		return super.getHelp(context);
	}
}
