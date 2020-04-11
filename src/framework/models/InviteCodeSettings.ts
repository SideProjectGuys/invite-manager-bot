import { Settings } from '../decorators/Setting';

import { InviteCode } from './InviteCode';

@Settings(InviteCode)
export class BaseInviteCodeSettings {}

export class InviteCodeSetting {
	public inviteCode: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public guildId: string;
	public value: {};
}
