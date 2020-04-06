import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { InvitesCache } from './cache/InvitesCache';
import { LeaderboardCache } from './cache/LeaderboardCache';
import { RanksCache } from './cache/RanksCache';
import { VanityUrlCache } from './cache/VanityUrlCache';
import { CaptchaService } from './services/Captcha';
import { InvitesService } from './services/Invites';
import { TrackingService } from './services/Tracking';

export class InviteModule extends IMModule {
	public constructor(client: IMClient) {
		super(client);

		this.registerService(CaptchaService);
		this.registerService(InvitesService);
		this.registerService(TrackingService);

		this.registerCache(InvitesCache);
		this.registerCache(LeaderboardCache);
		this.registerCache(RanksCache);
		this.registerCache(VanityUrlCache);
	}
}
