import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	UpdateDateColumn
} from 'typeorm';

import { Guild } from './Guild';
import { Member } from './Member';

export enum MemberSettingsKey {
	hideFromLeaderboard = 'hideFromLeaderboard'
}

@Entity()
export class MemberSetting extends BaseEntity {
	@Column({ length: 32, primary: true })
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public deletedAt: Date;

	@Column()
	public key: MemberSettingsKey;

	@Column({ type: 'text' })
	public value: string;

	@OneToMany(type => Guild, g => g.memberSettings)
	public guild: Guild;

	@OneToMany(type => Member, m => m.memberSettings)
	public member: Member;
}
