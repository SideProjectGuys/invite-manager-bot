import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';

export enum ScheduledActionType {
	unmute = 'unmute'
}

@Entity()
export class ScheduledAction {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public actionType: ScheduledActionType;

	@Column({ type: 'json' })
	public args: any;

	@Column()
	public date: Date;

	@Column()
	public reason: string;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.scheduledActions, { nullable: false })
	public guild: Guild;
}
