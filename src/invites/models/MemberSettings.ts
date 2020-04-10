import { Setting, Settings } from '../../framework/decorators/Setting';
import { InviteCode } from '../../framework/models/InviteCode';

const BASE_GROUP = 'invites';

@Settings(InviteCode)
export class InvitesMemberSettings {
	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP],
		defaultValue: false
	})
	public hideFromLeaderboard: boolean;
}
