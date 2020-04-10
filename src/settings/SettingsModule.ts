import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { GuildSettingsCache } from './cache/GuildSettings';
import { InviteCodeSettingsCache } from './cache/InviteCodeSettingsCache';
import { MemberSettingsCache } from './cache/MemberSettings';
import { SettingsService } from './services/Settings';

export class SettingsModule extends IMModule {
	public constructor(client: IMClient) {
		super(client);

		this.registerService(SettingsService);

		this.registerCache(GuildSettingsCache);
		this.registerCache(InviteCodeSettingsCache);
		this.registerCache(MemberSettingsCache);
	}
}
