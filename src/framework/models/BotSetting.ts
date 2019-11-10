import { BotSettingsObject } from '../../settings';

export enum BotSettingsKey {
	activityStatus = 'activityStatus',
	activityEnabled = 'activityEnabled',
	activityType = 'activityType',
	activityMessage = 'activityMessage',
	activityUrl = 'activityUrl',
	embedDefaultColor = 'embedDefaultColor'
}

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

export class BotSetting {
	public id: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public value: BotSettingsObject;
}
