import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';

import { Guild } from './Guild';
import { InviteCode } from './InviteCode';

@Entity()
export class Channel {
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

	@ManyToOne(type => Guild, g => g.channels)
	public guild: Guild;

	@OneToMany(type => InviteCode, i => i.channel)
	public inviteCodes: InviteCode[];
}
