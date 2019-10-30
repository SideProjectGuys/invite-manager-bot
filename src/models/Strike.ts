import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';
import { Member } from './Member';
import { ViolationType } from './StrikeConfig';

@Entity()
export class Strike {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.strikes, { nullable: false })
	public guild: Guild;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ type: 'enum', enum: Object.values(ViolationType) })
	public type: ViolationType;

	@Column()
	public amount: number;

	@Column({ length: 32, nullable: false })
	public memberId: string;

	@ManyToOne(type => Member, m => m.strikes, { nullable: false })
	public member: Member;
}
