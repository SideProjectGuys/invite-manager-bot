import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	UpdateDateColumn
} from 'typeorm';

import { Channel } from './Channel';
import { CommandUsage } from './CommandUsage';
import { CustomInvite } from './CustomInvite';
import { InviteCode } from './InviteCode';
import { Join } from './Join';
import { Punishment } from './Punishment';
import { PunishmentConfig } from './PunishmentConfig';
import { Rank } from './Rank';
import { ScheduledAction } from './ScheduledAction';
import { Strike } from './Strike';
import { StrikeConfig } from './StrikeConfig';

@Entity()
export class Guild extends BaseEntity {
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
	public icon: string;

	@Column()
	public memberCount: number;

	@OneToMany(type => Channel, c => c.guild)
	public channels: Channel[];

	@OneToMany(type => CommandUsage, c => c.guild)
	public commandUsages: CommandUsage[];

	@OneToMany(type => CustomInvite, c => c.guild)
	public customInvites: CustomInvite[];

	@OneToMany(type => InviteCode, i => i.guild)
	public inviteCodes: InviteCode[];

	@OneToMany(type => Join, j => j.guild)
	public joins: Join[];

	@OneToMany(type => Punishment, p => p.guild)
	public punishments: Punishment[];

	@OneToMany(type => PunishmentConfig, p => p.guild)
	public punishmentConfigs: PunishmentConfig[];

	@OneToMany(type => Rank, r => r.guild)
	public ranks: Rank[];

	@OneToMany(type => ScheduledAction, s => s.guild)
	public scheduledActions: ScheduledAction[];

	@OneToMany(type => Strike, s => s.guild)
	public strikes: Strike[];

	@OneToMany(type => StrikeConfig, s => s.guild)
	public strikeConfigs: StrikeConfig[];
}
