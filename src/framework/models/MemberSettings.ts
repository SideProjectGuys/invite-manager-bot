import { Settings } from '../decorators/Setting';

import { Member } from './Member';

@Settings(Member)
export class BaseMemberSettings {}

export class MemberSetting {
	public memberId: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public guildId: string;
	public value: {};
}
