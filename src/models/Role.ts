import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	UpdateDateColumn
} from 'typeorm';

import { Guild } from './Guild';
import { Rank } from './Rank';
import { RolePermission } from './RolePermission';

@Entity()
export class Role extends BaseEntity {
	@Column({ length: 32, primary: true })
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column()
	public name: string;

	@Column({ length: 7 })
	public color: string;

	@Column({ nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.roles)
	public guild: Guild;

	@OneToMany(type => Rank, r => r.guild)
	public ranks: Rank[];

	@OneToMany(type => RolePermission, r => r.role)
	public permissions: RolePermission[];
}
