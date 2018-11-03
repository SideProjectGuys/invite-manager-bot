import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

import { Guild } from './Guild';

export enum ScheduledActionType {
	unmute = 'unmute'
}

@Entity()
export class ScheduledAction extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public deletedAt: Date;

	@Column()
	public actionType: ScheduledActionType;

	@Column()
	public args: string;

	@Column()
	public date: Date;

	@Column()
	public reason: string;

	@ManyToOne(type => Guild, g => g.scheduledActions)
	public guild: Guild;
}
