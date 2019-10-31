export class PremiumSubscription {
	public id: number;
	public createdAt?: Date;
	public updatedAt?: Date;
	public amount: number;
	public maxGuilds: number;
	public isFreeTier: boolean;
	public validUntil: Date;
	public memberId: string;
	public reason: string;
}
