import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

import { Guild } from './Guild';

export enum PunishmentType {
	ban = 'ban',
	kick = 'kick',
	softban = 'softban',
	warn = 'warn',
	mute = 'mute'
}

@Entity()
@Index(['guild', 'punishmentType'], { unique: true })
export class PunishmentConfig extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public deletedAt: Date;

	@Column()
	public punishmentType: PunishmentType;

	@Column()
	public amount: number;

	@Column()
	public args: string;

	@ManyToOne(type => Guild, g => g.punishmentConfigs)
	public guild: Guild;
}
