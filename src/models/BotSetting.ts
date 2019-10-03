import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column({ length: 32, unique: true })
	public botId: string;

	@Column({ type: 'json' })
	public value: BotSettingsObject;
}
