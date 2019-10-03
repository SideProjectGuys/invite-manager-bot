import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';
import { Member } from './Member';

@Entity()
export class CustomInvite {
	@PrimaryGeneratedColumn()
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ type: 'bigint' })
	public amount: number;

	@Column({ type: 'text', nullable: true })
	public reason: string;

	@Column({ default: false })
	public cleared: boolean;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.customInvites, { nullable: false })
	public guild: Guild;

	@Column({ length: 32, nullable: false })
	public memberId: string;

	@ManyToOne(type => Member, m => m.customInvites, { nullable: false })
	public member: Member;

	@Column({ length: 32, nullable: false })
	public creatorId: string;

	@ManyToOne(type => Member, m => m.createdCustomInvites, { nullable: false })
	public creator: Member;
}
