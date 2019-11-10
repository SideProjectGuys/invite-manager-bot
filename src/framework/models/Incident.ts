export class Incident {
	public id: number;
	public guildId: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public error: string;
	public details: any;
}
