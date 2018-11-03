import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

import { Guild } from './Guild';
import { Member } from './Member';

export enum ViolationType {
	invites = 'invites',
	links = 'links',
	words = 'words',
	allCaps = 'allCaps',
	duplicateText = 'duplicateText',
	quickMessages = 'quickMessages',
	mentionUsers = 'mentionUsers',
	mentionRoles = 'mentionRoles',
	emojis = 'emojis'
}

@Entity()
export class Strike extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public deletedAt: Date;

	@Column()
	public violationType: ViolationType;

	@Column()
	public amount: number;

	@ManyToOne(type => Guild, g => g.strikes)
	public guild: Guild;

	@ManyToOne(type => Member, m => m.strikes)
	public member: Member;
}
