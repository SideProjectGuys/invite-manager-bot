import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { GuildSettingsCache } from './cache/GuildSettings';
import { InviteCodeSettingsCache } from './cache/InviteCodeSettingsCache';
import { MemberSettingsCache } from './cache/MemberSettings';

export class SettingsModule extends IMModule {
	public constructor(client: IMClient) {
		super(client);

		this.registerCache(GuildSettingsCache);
		this.registerCache(InviteCodeSettingsCache);
		this.registerCache(MemberSettingsCache);
	}
}
