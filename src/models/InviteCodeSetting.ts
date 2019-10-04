import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, UpdateDateColumn } from 'typeorm';

import { InviteCodeSettingsObject } from '../settings';

import { Guild } from './Guild';
import { InviteCode } from './InviteCode';

export enum InviteCodeSettingsKey {
	name = 'name',
	roles = 'roles'
}

@Entity({ engine: 'NDBCLUSTER PARTITION BY KEY (guildId)' })
export class InviteCodeSetting {
	@Column({ length: 32, primary: true, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.inviteCodeSettings, { primary: true, nullable: false })
	public guild: Guild;

	@Column({
		nullable: false,
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		length: 16,
		primary: true
	})
	public inviteCode: string;

	@OneToOne(type => InviteCode, i => i.setting, { primary: true, nullable: false })
	@JoinColumn()
	public invite: InviteCode;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ type: 'json' })
	public value: InviteCodeSettingsObject;
}
