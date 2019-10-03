import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';

export enum PunishmentType {
	ban = 'ban',
	kick = 'kick',
	softban = 'softban',
	warn = 'warn',
	mute = 'mute'
}

@Entity()
@Index(['guild', 'type'], { unique: true })
export class PunishmentConfig {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ type: 'enum', enum: Object.values(PunishmentType) })
	public type: PunishmentType;

	@Column()
	public amount: number;

	@Column()
	public args: string;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.punishmentConfigs, { nullable: false })
	public guild: Guild;
}
