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

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.channels, { nullable: false })
	public guild: Guild;

	@Column()
	public name: string;

	@OneToMany(type => InviteCode, i => i.channel)
	public inviteCodes: InviteCode[];
}
