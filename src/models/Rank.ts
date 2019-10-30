import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';
import { Role } from './Role';

@Entity()
export class Rank {
	@Column({ length: 32, primary: true, nullable: false })
	public roleId: string;

	@ManyToOne(type => Role, r => r.ranks, { primary: true, nullable: false })
	public role: Role;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.ranks, { nullable: false })
	public guild: Guild;

	@Column()
	public numInvites: number;

	@Column({ type: 'text' })
	public description: string;
}
