import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class MusicNode {
	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column()
	public host: string;

	@Column({ type: 'int' })
	public port: number;

	@Column()
	public region: string;

	@Column()
	public password: string;

	@Column()
	public isRegular: boolean;

	@Column()
	public isPremium: boolean;

	@Column()
	public isCustom: boolean;
}
