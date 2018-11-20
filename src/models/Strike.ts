import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

import { ViolationType } from '../types';

import { Guild } from './Guild';
import { Member } from './Member';

@Entity()
export class Strike extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column()
	public violationType: ViolationType;

	@Column()
	public amount: number;

	@Column({ nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.strikes)
	public guild: Guild;

	@Column({ nullable: true })
	public memberId: string;

	@ManyToOne(type => Member, m => m.strikes)
	public member: Member;
}
