import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	UpdateDateColumn
} from 'typeorm';

import { Channel } from './Channel';
import { Guild } from './Guild';
import { Join } from './Join';
import { Member } from './Member';

@Entity()
export class InviteCode extends BaseEntity {
	@Column({
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		length: 16,
		primary: true
	})
	public code: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public deletedAt: Date;

	@Column()
	public maxAge: number;

	@Column()
	public maxUses: number;

	@Column()
	public uses: number;

	@Column()
	public temporary: boolean;

	@ManyToOne(type => Guild, g => g.inviteCodes)
	public guild: Guild;

	@ManyToOne(type => Channel, c => c.inviteCodes)
	public channel: Channel;

	@ManyToOne(type => Member, m => m.inviteCodes)
	public inviter: Member;

	@OneToMany(type => Join, j => j.exactMatch)
	public joins: Join[];
}
