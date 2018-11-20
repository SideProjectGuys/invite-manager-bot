import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

import { Guild } from './Guild';
import { InviteCode } from './InviteCode';
import { Leave } from './Leave';
import { Member } from './Member';

@Entity()
@Index(['guild', 'member', 'createdAt'], { unique: true })
export class Join extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column({
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin'
	})
	public possibleMatches: string;

	@ManyToOne(type => Guild, g => g.joins)
	public guild: Guild;

	@ManyToOne(type => Member, m => m.joins)
	public member: Member;

	@ManyToOne(type => InviteCode, i => i.joins)
	public exactMatch: InviteCode;

	@OneToOne(type => Leave, l => l.join)
	public leave: Leave;
}
