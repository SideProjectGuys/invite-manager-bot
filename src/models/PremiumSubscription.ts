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

@Entity({ engine: 'NDBCLUSTER' })
export class PremiumSubscription {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	public amount: number;

	@Column({ type: 'int' })
	public maxGuilds: number;

	@Column()
	public isFreeTier: boolean;

	@Column()
	public validUntil: Date;

	@Column({ length: 32, nullable: false })
	public memberId: string;

	@ManyToOne(type => Member, m => m.premiumSubscriptions, { nullable: false })
	public member: Member;

	@Column()
	public reason: string;

	@OneToMany(type => PremiumSubscriptionGuild, psg => psg.guild)
	public guilds: PremiumSubscriptionGuild[];
}
