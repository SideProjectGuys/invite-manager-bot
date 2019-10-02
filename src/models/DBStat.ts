import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Channel extends BaseEntity {
	@PrimaryColumn()
	public key: string;

	@Column({ type: 'double' })
	public value: number;
}
