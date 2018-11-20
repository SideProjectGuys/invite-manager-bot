import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

import { InternalSettingsTypes } from '../types';

import { Guild } from './Guild';
import { InviteCode } from './InviteCode';

export enum InviteCodeSettingsKey {
	name = 'name',
	roles = 'roles'
}

export type InviteCodeSettingsObject = {
	name: string;
	roles: string[];
};

export type InviteCodeSettingsTypesObject = {
	[k in InviteCodeSettingsKey]: InternalSettingsTypes
};

export const inviteCodeSettingsTypes: InviteCodeSettingsTypesObject = {
	name: 'String',
	roles: 'Role[]'
};

export const defaultInviteCodeSettings: InviteCodeSettingsObject = {
	name: null,
	roles: null
};

@Entity()
export class InviteCodeSetting extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column()
	public key: InviteCodeSettingsKey;

	@Column({ type: 'text' })
	public value: string;

	@Column({ nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.inviteCodeSettings)
	public guild: Guild;

	@Column({
		nullable: true,
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		length: 16
	})
	public inviteCode: string;

	@ManyToOne(type => InviteCode, i => i.inviteCodeSettings)
	public invite: InviteCode;
}
