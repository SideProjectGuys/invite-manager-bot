import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';
import { Rank } from './Rank';
import { RolePermission } from './RolePermission';

@Entity({ engine: 'NDBCLUSTER PARTITION BY KEY (guildId)' })
export class Role {
	@Column({ length: 32, primary: true, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.roles, { primary: true, nullable: false })
	public guild: Guild;

	@Column({ length: 32, primary: true })
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public name: string;

	@Column({ length: 7 })
	public color: string;

	@OneToMany(type => Rank, r => r.guild)
	public ranks: Rank[];

	@OneToMany(type => RolePermission, r => r.role)
	public permissions: RolePermission[];
}
