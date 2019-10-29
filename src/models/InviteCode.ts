import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, UpdateDateColumn } from 'typeorm';

import { Channel } from './Channel';
import { Guild } from './Guild';
import { InviteCodeSetting } from './InviteCodeSetting';
import { Join } from './Join';
import { Member } from './Member';

@Entity()
export class InviteCode {
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

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.inviteCodes, { nullable: false })
	public guild: Guild;

	@Column()
	public maxAge: number;

	@Column()
	public maxUses: number;

	@Column()
	public uses: number;

	@Column()
	public temporary: boolean;

	@Column({ type: 'int' })
	public clearedAmount: number;

	@Column()
	public isVanity: boolean;

	@Column()
	public isWidget: boolean;

	@Column({ length: 32, nullable: true })
	public channelId: string;

	@ManyToOne(type => Channel, c => c.inviteCodes, { nullable: true })
	public channel: Channel;

	@Column({ length: 32, nullable: true })
	public inviterId: string;

	@ManyToOne(type => Member, m => m.inviteCodes)
	public inviter: Member;

	@OneToOne(type => InviteCodeSetting, i => i.invite)
	public setting: InviteCodeSetting;

	@OneToMany(type => Join, j => j.exactMatch)
	public joins: Join[];
}
