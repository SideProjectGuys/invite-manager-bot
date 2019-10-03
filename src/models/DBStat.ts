import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class DBStat {
	@PrimaryColumn()
	public key: string;

	@Column({ type: 'double' })
	public value: number;
}
