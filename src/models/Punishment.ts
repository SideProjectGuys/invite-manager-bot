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
import { PunishmentType } from './PunishmentConfig';

@Entity()
export class Punishment extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column()
	public punishmentType: PunishmentType;

	@Column()
	public amount: number;

	@Column()
	public args: string;

	@Column({ nullable: true })
	public reason: string;

	@Column({ nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.punishments)
	public guild: Guild;

	@Column({ nullable: true })
	public memberId: string;

	@ManyToOne(type => Member, m => m.punishments)
	public member: Member;

	@Column({ nullable: true })
	public creatorId: string;

	@ManyToOne(type => Member, m => m.createdPunishments)
	public creator: Member;
}
