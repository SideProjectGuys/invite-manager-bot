import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

import { Guild } from './Guild';
import { InviteCode } from './InviteCode';
import { Join } from './Join';
import { Member } from './Member';

@Entity()
@Index(['guild', 'member', 'join'], { unique: true })
export class Leave extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@ManyToOne(type => Guild, g => g.joins)
	public guild: Guild;

	@ManyToOne(type => Member, m => m.joins)
	public member: Member;

	@OneToOne(type => Join, j => j.leave)
	@JoinColumn()
	public join: InviteCode;
}
