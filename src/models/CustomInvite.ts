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

export enum CustomInvitesGeneratedReason {
	clear_regular = 'clear_regular',
	clear_custom = 'clear_custom',
	clear_fake = 'clear_fake',
	clear_leave = 'clear_leave',
	fake = 'fake',
	leave = 'leave'
}

@Entity()
export class CustomInvite extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public deletedAt: Date;

	@Column()
	public amount: number;

	@Column({ type: 'text' })
	public reason: string;

	@Column()
	public generatedReason: CustomInvitesGeneratedReason;

	@ManyToOne(type => Guild, g => g.customInvites)
	public guild: Guild;

	@ManyToOne(type => Member, m => m.customInvites)
	public member: Member;

	@ManyToOne(type => Member, m => m.createdCustomInvites)
	public creator: Member;
}
