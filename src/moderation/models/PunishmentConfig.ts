export enum PunishmentType {
	ban = 'ban',
	kick = 'kick',
	softban = 'softban',
	warn = 'warn',
	mute = 'mute'
}

export class PunishmentConfig {
	public id: number;
	public guildId: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public type: PunishmentType;
	public amount: number;
	public args: string;
}
