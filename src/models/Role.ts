import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	UpdateDateColumn
} from 'typeorm';

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

	@Column()
	public deletedAt: Date;

	@Column()
	public name: string;

	@Column({ length: 7 })
	public color: string;

	@OneToMany(type => Rank, r => r.guild)
	public ranks: Rank[];

	@OneToMany(type => RolePermission, r => r.role)
	public permissions: RolePermission[];
}
