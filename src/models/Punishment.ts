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

export enum PunishmentType {
	ban = 'ban',
	kick = 'kick',
	softban = 'softban',
	warn = 'warn',
	mute = 'mute'
}

@Entity()
export class Punishment extends BaseEntity {
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

	@ManyToOne(type => Guild, g => g.punishments)
	public guild: Guild;

	@ManyToOne(type => Member, m => m.punishments)
	public member: Member;

	@ManyToOne(type => Member, m => m.createdPunishments)
	public creator: Member;
}
