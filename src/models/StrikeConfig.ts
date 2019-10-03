import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';

export enum ViolationType {
	invites = 'invites',
	links = 'links',
	words = 'words',
	allCaps = 'allCaps',
	duplicateText = 'duplicateText',
	quickMessages = 'quickMessages',
	mentionUsers = 'mentionUsers',
	mentionRoles = 'mentionRoles',
	emojis = 'emojis',
	hoist = 'hoist'
}

@Entity()
@Index(['guild', 'violationType'], { unique: true })
export class StrikeConfig {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column()
	public type: ViolationType;

	@Column()
	public amount: number;

	@Column({ nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.strikeConfigs)
	public guild: Guild;
}
