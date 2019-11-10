export enum JoinInvalidatedReason {
	fake = 'fake',
	leave = 'leave'
}

export class Join {
	public id: number;
	public guildId: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public memberId: string;
	public exactMatchCode: string;
	public invalidatedReason: JoinInvalidatedReason;
	public cleared: boolean;
}
