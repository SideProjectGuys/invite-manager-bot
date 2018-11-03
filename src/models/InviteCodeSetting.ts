import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	UpdateDateColumn
} from 'typeorm';

import { Guild } from './Guild';
import { InviteCode } from './InviteCode';

export enum InviteCodeSettingsKey {
	name = 'name',
	roles = 'roles'
}

@Entity()
export class InviteCodeSetting extends BaseEntity {
	@Column({ length: 32, primary: true })
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public deletedAt: Date;

	@Column()
	public key: InviteCodeSettingsKey;

	@Column({ type: 'text' })
	public value: string;

	@OneToMany(type => Guild, g => g.inviteCodeSettings)
	public guild: Guild;

	@OneToMany(type => InviteCode, i => i.inviteCodeSettings)
	public invite: InviteCode;
}
