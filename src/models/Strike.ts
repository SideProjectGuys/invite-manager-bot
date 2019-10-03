import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';
import { Member } from './Member';
import { ViolationType } from './StrikeConfig';

@Entity()
export class Strike {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column()
	public type: ViolationType;

	@Column()
	public amount: number;

	@Column({ nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.strikes)
	public guild: Guild;

	@Column({ nullable: true })
	public memberId: string;

	@ManyToOne(type => Member, m => m.strikes)
	public member: Member;
}
