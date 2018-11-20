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

@Entity()
export class PremiumSubscription extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	public amount: number;

	@Column()
	public validUntil: Date;

	@Column({ nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.premiumSubscriptions)
	public guild: Guild;

	@ManyToOne(type => Member, m => m.premiumSubscriptions)
	public member: Member;
}
