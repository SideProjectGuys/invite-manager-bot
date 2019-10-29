import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';

@Entity()
export class Incident {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.incidents, { nullable: false })
	public guild: Guild;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ type: 'text' })
	public error: string;

	@Column({ type: 'json' })
	public details: any;
}
