import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';
import { Member } from './Member';

@Entity({ engine: 'NDBCLUSTER' })
export class CommandUsage {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column()
	public command: string;

	@Column({ type: 'text' })
	public args: string;

	@Column({ type: 'float' })
	public time: number;

	@Column()
	public errored: boolean;

	@Column({ length: 32, nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.commandUsages, { nullable: true })
	public guild: Guild;

	@Column({ length: 32, nullable: false })
	public memberId: string;

	@ManyToOne(type => Member, m => m.commandUsages, { nullable: false })
	public member: Member;
}
