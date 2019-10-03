import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';
import { PremiumSubscription } from './PremiumSubscription';

@Entity()
export class PremiumSubscriptionGuild {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column({ nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.premiumSubscriptions)
	public guild: Guild;

	@Column({ nullable: false })
	public subscriptionId: number;

	@ManyToOne(type => PremiumSubscription, ps => ps.guilds)
	public subscription: PremiumSubscription;
}
