import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

import { Guild } from './Guild';
import { Member } from './Member';

export enum LogAction {
	addInvites = 'addInvites',
	clearInvites = 'clearInvites',
	restoreInvites = 'restoreInvites',
	config = 'config',
	memberConfig = 'memberConfig',
	addRank = 'addRank',
	updateRank = 'updateRank',
	removeRank = 'removeRank',
	owner = 'owner'
}

@Entity()
export class Log extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public deletedAt: Date;

	@Column()
	public action: LogAction;

	@Column({ type: 'text' })
	public message: string;

	@Column({ type: 'json' })
	public data: any;

	@Column({ nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.logs)
	public guild: Guild;

	@Column({ nullable: true })
	public memberId: string;

	@ManyToOne(type => Member, m => m.logs)
	public member: Member;
}
