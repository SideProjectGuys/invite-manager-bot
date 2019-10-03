import {
	Column,
	CreateDateColumn,
	Entity,
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
export class Leave {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.joins, { nullable: false })
	public guild: Guild;

	@Column({ length: 32, nullable: false })
	public memberId: string;

	@ManyToOne(type => Member, m => m.leaves, { nullable: false })
	public member: Member;

	@Column({ nullable: true })
	public joinId: number;

	@OneToOne(type => Join, j => j.leave)
	@JoinColumn()
	public join: InviteCode;
}
