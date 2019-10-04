import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';
import { PremiumSubscription } from './PremiumSubscription';

@Entity({ engine: 'NDBCLUSTER' })
export class PremiumSubscriptionGuild {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.premiumSubscriptions, { nullable: false })
	public guild: Guild;

	@Column({ nullable: false })
	public subscriptionId: number;

	@ManyToOne(type => PremiumSubscription, ps => ps.guilds, { nullable: false })
	public subscription: PremiumSubscription;
}
