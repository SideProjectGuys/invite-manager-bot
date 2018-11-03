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

	@Column()
	public deletedAt: Date;

	@Column({ type: 'decimal', length: '10,2' })
	public amount: number;

	@Column()
	public validUntil: Date;

	@ManyToOne(type => Guild, g => g.premiumSubscriptions)
	public guild: Guild;

	@ManyToOne(type => Member, m => m.premiumSubscriptions)
	public member: Member;
}
