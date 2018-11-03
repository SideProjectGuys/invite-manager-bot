import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	UpdateDateColumn
} from 'typeorm';

import { CommandUsage } from './CommandUsage';
import { CustomInvite } from './CustomInvite';
import { InviteCode } from './InviteCode';
import { Join } from './Join';
import { Log } from './Log';
import { MemberSetting } from './MemberSetting';
import { PremiumSubscription } from './PremiumSubscription';
import { Punishment } from './Punishment';
import { Strike } from './Strike';

@Entity()
export class Member extends BaseEntity {
	@Column({ length: 32, primary: true })
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public deletedAt: Date;

	@Column()
	public name: string;

	@Column()
	public discriminator: string;

	@OneToMany(type => CommandUsage, c => c.member)
	public commandUsages: CommandUsage[];

	@OneToMany(type => CustomInvite, c => c.member)
	public customInvites: CustomInvite[];

	@OneToMany(type => InviteCode, i => i.inviter)
	public inviteCodes: InviteCode[];

	@OneToMany(type => Join, j => j.member)
	public joins: Join[];

	@OneToMany(type => Log, l => l.member)
	public logs: Log[];

	@OneToMany(type => MemberSetting, m => m.member)
	public memberSettings: MemberSetting[];

	@OneToMany(type => PremiumSubscription, p => p.member)
	public premiumSubscriptions: PremiumSubscription[];

	@OneToMany(type => Punishment, p => p.member)
	public punishments: Punishment[];

	@OneToMany(type => Strike, s => s.member)
	public strikes: Strike[];

	@OneToMany(type => CustomInvite, c => c.creator)
	public createdCustomInvites: CustomInvite[];

	@OneToMany(type => Punishment, p => p.creator)
	public createdPunishments: Punishment[];
}
