import { InviteCodeSettingsObject } from '../../settings';

export enum InviteCodeSettingsKey {
	name = 'name',
	roles = 'roles'
}

export class InviteCodeSetting {
	public inviteCode: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public guildId: string;
	public value: InviteCodeSettingsObject;
}
