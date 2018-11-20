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
import { Member } from './Member';

export enum MemberSettingsKey {
	hideFromLeaderboard = 'hideFromLeaderboard'
}

export type MemberSettingsObject = {
	hideFromLeaderboard: boolean;
};

export type MemberSettingsTypesObject = {
	[k in MemberSettingsKey]: InternalSettingsTypes
};

export const memberSettingsTypes: MemberSettingsTypesObject = {
	hideFromLeaderboard: 'Boolean'
};

export const defaultMemberSettings: MemberSettingsObject = {
	hideFromLeaderboard: false
};

@Entity()
export class MemberSetting extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column()
	public key: MemberSettingsKey;

	@Column({ type: 'text' })
	public value: string;

	@ManyToOne(type => Guild, g => g.memberSettings)
	public guild: Guild;

	@ManyToOne(type => Member, m => m.memberSettings)
	public member: Member;
}
