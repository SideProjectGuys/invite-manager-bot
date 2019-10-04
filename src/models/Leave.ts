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

@Entity({ engine: 'NDBCLUSTER PARTITION BY KEY (guildId)' })
export class Leave {
	@Column({ length: 32, primary: true, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.joins, { primary: true, nullable: false })
	public guild: Guild;

	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

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
