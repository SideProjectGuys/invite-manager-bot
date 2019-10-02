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

@Entity()
export class Incident extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@ManyToOne(type => Guild, g => g.incidents)
	public guild: Guild;

	@Column({ type: 'text' })
	public error: string;

	@Column({ type: 'json' })
	public details: any;
}
