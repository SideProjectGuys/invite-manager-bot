import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';
import { Role } from './Role';

@Entity()
export class Rank {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public numInvites: number;

	@Column({ type: 'text' })
	public description: string;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.ranks, { nullable: false })
	public guild: Guild;

	@Column({ length: 32, nullable: false })
	public roleId: string;

	@ManyToOne(type => Role, r => r.ranks, { nullable: false })
	public role: Role;
}
