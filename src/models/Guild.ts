import { Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from 'typeorm';

import { Channel } from './Channel';
import { CommandUsage } from './CommandUsage';
import { CustomInvite } from './CustomInvite';
import { Incident } from './Incident';
import { InviteCode } from './InviteCode';
import { InviteCodeSetting } from './InviteCodeSetting';
import { Join } from './Join';
import { Log } from './Log';
import { MemberSetting } from './MemberSetting';
import { PremiumSubscriptionGuild } from './PremiumSubscriptionGuild';
import { Punishment } from './Punishment';
import { PunishmentConfig } from './PunishmentConfig';
import { Rank } from './Rank';
import { Role } from './Role';
import { ScheduledAction } from './ScheduledAction';
import { Setting } from './Setting';
import { Strike } from './Strike';
import { StrikeConfig } from './StrikeConfig';

@Entity()
export class Guild {
	@Column({ length: 32, primary: true })
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column()
	public name: string;

	@Column({ nullable: true })
	public icon: string;

	@Column()
	public memberCount: number;

	@Column({ nullable: true })
	public banReason: string;

	@OneToMany(type => Channel, c => c.guild)
	public channels: Channel[];

	@OneToMany(type => CommandUsage, c => c.guild)
	public commandUsages: CommandUsage[];

	@OneToMany(type => CustomInvite, c => c.guild)
	public customInvites: CustomInvite[];

	@OneToMany(type => InviteCode, i => i.guild)
	public inviteCodes: InviteCode[];

	@OneToMany(type => InviteCodeSetting, i => i.guild)
	public inviteCodeSettings: InviteCodeSetting[];

	@OneToMany(type => Join, j => j.guild)
	public joins: Join[];

	@OneToMany(type => Log, l => l.guild)
	public logs: Log[];

	@OneToMany(type => MemberSetting, m => m.guild)
	public memberSettings: MemberSetting[];

	@OneToMany(type => PremiumSubscriptionGuild, psg => psg.guild)
	public premiumSubscriptions: PremiumSubscriptionGuild[];

	@OneToMany(type => Punishment, p => p.guild)
	public punishments: Punishment[];

	@OneToMany(type => PunishmentConfig, p => p.guild)
	public punishmentConfigs: PunishmentConfig[];

	@OneToMany(type => Rank, r => r.guild)
	public ranks: Rank[];

	@OneToMany(type => ScheduledAction, s => s.guild)
	public scheduledActions: ScheduledAction[];

	@OneToMany(type => Setting, s => s.guild)
	public settings: Setting[];

	@OneToMany(type => Strike, s => s.guild)
	public strikes: Strike[];

	@OneToMany(type => StrikeConfig, s => s.guild)
	public strikeConfigs: StrikeConfig[];

	@OneToMany(type => Role, r => r.guild)
	public roles: Role[];

	@OneToMany(type => Incident, i => i.guild)
	public incidents: Incident[];
}
