import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { InvitesCache } from './cache/InvitesCache';
import { LeaderboardCache } from './cache/LeaderboardCache';
import { RanksCache } from './cache/RanksCache';
import { VanityUrlCache } from './cache/VanityUrlCache';
import './models/GuildSettings';
import './models/InviteCodeSettings';
import './models/MemberSettings';
import { InvitesService } from './services/Invites';
import { RanksService } from './services/Ranks';
import { TrackingService } from './services/Tracking';

export class InviteModule extends IMModule {
	public constructor(client: IMClient) {
		super(client);

		this.registerService(InvitesService);
		this.registerService(TrackingService);
		this.registerService(RanksService);

		this.registerCache(InvitesCache);
		this.registerCache(LeaderboardCache);
		this.registerCache(RanksCache);
		this.registerCache(VanityUrlCache);
	}
}
