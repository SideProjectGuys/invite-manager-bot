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
import { Role } from './Role';

@Entity()
export class Rank extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column()
	public numInvites: number;

	@Column({ type: 'text' })
	public description: string;

	@Column({ nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.ranks)
	public guild: Guild;

	@Column({ nullable: true })
	public roleId: string;

	@ManyToOne(type => Role, r => r.ranks)
	public role: Role;
}
