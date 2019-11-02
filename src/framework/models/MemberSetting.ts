import { MemberSettingsObject } from '../../settings';

export enum MemberSettingsKey {
	hideFromLeaderboard = 'hideFromLeaderboard'
}

export class MemberSetting {
	public memberId: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public guildId: string;
	public value: MemberSettingsObject;
}
