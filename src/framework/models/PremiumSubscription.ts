export class PremiumSubscription {
	public id: string;
	public memberId: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public amount: number;
	public maxGuilds: number;
	public isFreeTier: boolean;
	public isPatreon: boolean;
	public isStaff: boolean;
	public validUntil: Date;
	public reason: string;
}
