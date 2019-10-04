import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';
import { Member } from './Member';

@Entity({ engine: 'NDBCLUSTER PARTITION BY KEY (guildId)' })
export class CustomInvite {
	@Column({ length: 32, primary: true, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.customInvites, { primary: true, nullable: false })
	public guild: Guild;

	@PrimaryGeneratedColumn()
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ type: 'bigint' })
	public amount: string;

	@Column({ type: 'text', nullable: true })
	public reason: string;

	@Column({ default: false })
	public cleared: boolean;

	@Column({ length: 32, nullable: false })
	public memberId: string;

	@ManyToOne(type => Member, m => m.customInvites, { nullable: false })
	public member: Member;

	@Column({ length: 32, nullable: false })
	public creatorId: string;

	@ManyToOne(type => Member, m => m.createdCustomInvites, { nullable: false })
	public creator: Member;
}
