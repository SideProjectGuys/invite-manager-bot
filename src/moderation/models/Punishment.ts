import { PunishmentType } from './PunishmentConfig';

export class Punishment {
	public id: number;
	public guildId: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public type: PunishmentType;
	public amount: number;
	public args: string;
	public reason: string;
	public memberId: string;
	public creatorId: string;
}
