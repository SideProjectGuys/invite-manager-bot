import { Column, CreateDateColumn, Entity, Index, OneToMany, OneToOne, UpdateDateColumn } from 'typeorm';

import { CommandUsage } from './CommandUsage';
import { CustomInvite } from './CustomInvite';
import { InviteCode } from './InviteCode';
import { Join } from './Join';
import { Leave } from './Leave';
import { Log } from './Log';
import { MemberSetting } from './MemberSetting';
import { PremiumSubscription } from './PremiumSubscription';
import { Punishment } from './Punishment';
import { Strike } from './Strike';

@Entity({ engine: 'NDBCLUSTER' })
@Index(['name'])
export class Member {
	@Column({ length: 32, primary: true })
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

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

	@OneToMany(type => Leave, l => l.member)
	public leaves: Leave[];

	@OneToMany(type => Log, l => l.member)
	public logs: Log[];

	@OneToOne(type => MemberSetting, m => m.member)
	public setting: MemberSetting;

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
