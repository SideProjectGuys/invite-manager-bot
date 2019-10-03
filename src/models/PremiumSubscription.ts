import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

import { Member } from './Member';
import { PremiumSubscriptionGuild } from './PremiumSubscriptionGuild';

@Entity()
export class PremiumSubscription {
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

	@Column({ type: 'int' })
	public maxGuilds: number;

	@Column()
	public isFreeTier: boolean;

	@Column()
	public validUntil: Date;

	@Column({ nullable: false })
	public memberId: string;

	@ManyToOne(type => Member, m => m.premiumSubscriptions)
	public member: Member;

	@Column()
	public reason: string;

	@OneToMany(type => PremiumSubscriptionGuild, psg => psg.guild)
	public guilds: PremiumSubscriptionGuild[];
}
