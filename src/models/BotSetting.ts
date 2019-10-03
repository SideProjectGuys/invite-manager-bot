import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

import { BotSettingsObject } from '../settings';

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

@Entity()
export class BotSetting {
	@Column({ length: 32, primary: true })
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ type: 'json' })
	public value: BotSettingsObject;
}
