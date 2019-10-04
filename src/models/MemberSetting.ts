import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, UpdateDateColumn } from 'typeorm';

import { MemberSettingsObject } from '../settings';

import { Guild } from './Guild';
import { Member } from './Member';

export enum MemberSettingsKey {
	hideFromLeaderboard = 'hideFromLeaderboard'
}

@Entity({ engine: 'NDBCLUSTER' })
export class MemberSetting {
	@Column({ length: 32, primary: true, nullable: false })
	public memberId: string;

	@OneToOne(type => Member, m => m.setting, { primary: true, nullable: false })
	@JoinColumn()
	public member: Member;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.memberSettings, { nullable: false })
	public guild: Guild;

	@Column({ type: 'json' })
	public value: MemberSettingsObject;
}
