export class CommandUsage {
	public id: number;
	public createdAt?: Date;
	public updatedAt?: Date;
	public command: string;
	public args: string;
	public time: number;
	public errored: boolean;
	public guildId: string;
	public memberId: string;
}
