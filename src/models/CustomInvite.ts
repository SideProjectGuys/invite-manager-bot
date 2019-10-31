export class CustomInvite {
	public id: string;
	public guildId: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public amount: string;
	public reason: string;
	public cleared: boolean;
	public memberId: string;
	public creatorId: string;
}
