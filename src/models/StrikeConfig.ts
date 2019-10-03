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
@Index(['guild', 'type'], { unique: true })
export class StrikeConfig {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ type: 'enum', enum: Object.values(ViolationType) })
	public type: ViolationType;

	@Column()
	public amount: number;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.strikeConfigs, { nullable: false })
	public guild: Guild;
}
