export class InviteCode {
	public code: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public guildId: string;
	public maxAge: number;
	public maxUses: number;
	public uses: number;
	public temporary: boolean;
	public clearedAmount: number;
	public isVanity: boolean;
	public isWidget: boolean;
	public channelId: string;
	public inviterId: string;
}
