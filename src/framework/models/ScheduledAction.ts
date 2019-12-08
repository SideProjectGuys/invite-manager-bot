export enum ScheduledActionType {
	unmute = 'unmute',
	unlock = 'unlock'
}

export class ScheduledAction {
	public id: number;
	public guildId: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public actionType: ScheduledActionType;
	public args: any;
	public date: Date;
	public reason: string;
}
