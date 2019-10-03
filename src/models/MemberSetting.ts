import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { MemberSettingsObject } from '../settings';

import { Guild } from './Guild';
import { Member } from './Member';

export enum MemberSettingsKey {
	hideFromLeaderboard = 'hideFromLeaderboard'
}

@Entity()
export class MemberSetting {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.memberSettings, { nullable: false })
	public guild: Guild;

	@Column({ length: 32, nullable: false })
	public memberId: string;

	@ManyToOne(type => Member, m => m.memberSettings, { nullable: false })
	public member: Member;

	@Column({ type: 'json' })
	public value: MemberSettingsObject;
}
