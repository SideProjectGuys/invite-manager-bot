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
import { Member } from './Member';

@Entity()
export class CommandUsage extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public deletedAt: Date;

	@Column()
	public command: string;

	@Column({ type: 'text' })
	public args: string;

	@Column({ type: 'float' })
	public time: number;

	@ManyToOne(type => Guild, g => g.commandUsages)
	public guild: Guild;

	@ManyToOne(type => Member, m => m.commandUsages)
	public member: Member;
}
