import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';
import { Member } from './Member';
import { PunishmentType } from './PunishmentConfig';

@Entity()
export class Punishment {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.punishments, { nullable: false })
	public guild: Guild;

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

	@Column({ nullable: true })
	public reason: string;

	@Column({ length: 32, nullable: false })
	public memberId: string;

	@ManyToOne(type => Member, m => m.punishments, { nullable: false })
	public member: Member;

	@Column({ length: 32, nullable: false })
	public creatorId: string;

	@ManyToOne(type => Member, m => m.createdPunishments, { nullable: false })
	public creator: Member;
}
