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

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column({ type: 'bigint' })
	public amount: number;

	@Column({ type: 'text' })
	public reason: string;

	@Column()
	public cleared: boolean;

	@Column({ nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.customInvites)
	public guild: Guild;

	@Column({ nullable: true })
	public memberId: string;

	@ManyToOne(type => Member, m => m.customInvites)
	public member: Member;

	@Column({ nullable: true })
	public creatorId: string;

	@ManyToOne(type => Member, m => m.createdCustomInvites)
	public creator: Member;
}
