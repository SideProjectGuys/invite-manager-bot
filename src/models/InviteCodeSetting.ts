import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { InviteCodeSettingsObject } from '../settings';

import { Guild } from './Guild';
import { InviteCode } from './InviteCode';

export enum InviteCodeSettingsKey {
	name = 'name',
	roles = 'roles'
}

@Entity()
export class InviteCodeSetting {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column({ nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.inviteCodeSettings)
	public guild: Guild;

	@Column({
		nullable: false,
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		length: 16
	})
	public inviteCode: string;

	@ManyToOne(type => InviteCode, i => i.inviteCodeSettings)
	public invite: InviteCode;

	@Column({ type: 'json' })
	public value: InviteCodeSettingsObject;
}
