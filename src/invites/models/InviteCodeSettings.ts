import { Setting, Settings } from '../../framework/decorators/Setting';
import { InviteCode } from '../../framework/models/InviteCode';

const BASE_GROUP = 'invites';

@Settings(InviteCode)
export class InvitesInviteCodeSettings {
	@Setting({
		type: 'String',
		grouping: [BASE_GROUP],
		defaultValue: null
	})
	public name: string;

	@Setting({
		type: 'Role[]',
		grouping: [BASE_GROUP],
		defaultValue: []
	})
	public roles: string[];
}
