import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Role } from './Role';

@Entity()
export class RolePermission {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public command: string;

	@Column({ length: 32, nullable: false })
	public roleId: string;

	@ManyToOne(type => Role, r => r.permissions, { nullable: false })
	public role: Role;
}
