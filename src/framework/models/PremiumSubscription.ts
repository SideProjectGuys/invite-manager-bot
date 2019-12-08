export class PremiumSubscription {
	public id: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public amount: number;
	public maxGuilds: number;
	public isFreeTier: boolean;
	public isPatreon: boolean;
	public validUntil: Date;
	public memberId: string;
	public reason: string;
}
