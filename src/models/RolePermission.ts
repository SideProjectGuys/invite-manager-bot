import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';

import { Role } from './Role';

@Entity({ engine: 'NDBCLUSTER PARTITION BY KEY (roleId)' })
export class RolePermission {
	@Column({ length: 32, nullable: false })
	public roleId: string;

	@ManyToOne(type => Role, r => r.permissions, { nullable: false })
	public role: Role;

	@Column({ primary: true, nullable: false })
	public command: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;
}
