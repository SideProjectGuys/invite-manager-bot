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

import { PunishmentType } from '../types';

import { Guild } from './Guild';

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

	@Column({ nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.punishmentConfigs)
	public guild: Guild;
}
