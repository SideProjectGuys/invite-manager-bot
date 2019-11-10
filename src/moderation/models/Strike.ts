import { ViolationType } from './StrikeConfig';

export interface Strike {
	id: number;
	guildId: string;
	createdAt?: Date;
	updatedAt?: Date;
	type: ViolationType;
	amount: number;
	memberId: string;
}
