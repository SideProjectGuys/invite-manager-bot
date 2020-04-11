import { Client } from 'eris';

import { Setting, Settings } from '../decorators/Setting';

export enum ActivityStatus {
	online = 'online',
	dnd = 'dnd',
	idle = 'idle'
}

export enum ActivityType {
	playing = 'playing',
	streaming = 'streaming',
	listening = 'listening',
	watching = 'watching'
}

const BASE_GROUP = 'general';

@Settings(Client)
export class BaseBotSettings {
	@Setting({
		type: 'Enum',
		grouping: [BASE_GROUP],
		defaultValue: ActivityStatus.online,
		possibleValues: Object.values(ActivityStatus)
	})
	public activityStatus: ActivityStatus;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP],
		defaultValue: true
	})
	public activityEnabled: boolean;

	@Setting({
		type: 'Enum',
		grouping: [BASE_GROUP],
		defaultValue: ActivityType.playing,
		possibleValues: Object.values(ActivityType)
	})
	public activityType: ActivityType;

	@Setting({
		type: 'String',
		grouping: [BASE_GROUP],
		defaultValue: null
	})
	public activityMessage: string;

	@Setting({
		type: 'String',
		grouping: [BASE_GROUP],
		defaultValue: null,
		validate: (_, value, { t }) => {
			const url = value as string;
			if (!url.startsWith('https://twitch.tv/')) {
				return t('cmd.botConfig.invalid.twitchOnly');
			}

			return null;
		}
	})
	public activityUrl: string;

	@Setting({
		type: 'String',
		grouping: [BASE_GROUP],
		defaultValue: null
	})
	public embedDefaultColor: string;
}

export class BotSetting {
	public id: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public value: BaseBotSettings;
}
