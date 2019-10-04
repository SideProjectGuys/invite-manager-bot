import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';

export enum ScheduledActionType {
	unmute = 'unmute'
}

@Entity({ engine: 'NDBCLUSTER PARTITION BY KEY (guildId)' })
export class ScheduledAction {
	@Column({ length: 32, primary: true, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.scheduledActions, { primary: true, nullable: false })
	public guild: Guild;

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
}
