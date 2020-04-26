import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { InvitesCache } from './cache/InvitesCache';
import { LeaderboardCache } from './cache/LeaderboardCache';
import { RanksCache } from './cache/RanksCache';
import { VanityCache } from './cache/VanityCache';
import graph from './commands/graph';
import addInvites from './commands/invites/add-invites';
import clearInvites from './commands/invites/clear-invites';
import createInvite from './commands/invites/create-invite';
import info from './commands/invites/info';
import inviteCodes from './commands/invites/invite-codes';
import inviteDetails from './commands/invites/invite-details';
import invites from './commands/invites/invites';
import leaderboard from './commands/invites/leaderboard';
import removeInvites from './commands/invites/remove-invites';
import restoreInvites from './commands/invites/restore-invites';
import subtractFakes from './commands/invites/subtract-fakes';
import subtractLeaves from './commands/invites/subtract-leaves';
import exportLeaderboard from './commands/premium/export-leaderboard';
import addRank from './commands/ranks/add-rank';
import fixRanks from './commands/ranks/fix-ranks';
import ranks from './commands/ranks/ranks';
import removeRank from './commands/ranks/remove-rank';
import './models/GuildSettings';
import './models/InviteCodeSettings';
import './models/MemberSettings';
import { InvitesService } from './services/Invites';
import { RanksService } from './services/Ranks';
import { TrackingService } from './services/Tracking';

export class InviteModule extends IMModule {
	public name: string = 'Invites';

	public constructor(client: IMClient) {
		super(client);

		// Services
		this.registerService(InvitesService);
		this.registerService(TrackingService);
		this.registerService(RanksService);

		// Caches
		this.registerCache(InvitesCache);
		this.registerCache(LeaderboardCache);
		this.registerCache(RanksCache);
		this.registerCache(VanityCache);

		// Commands
		this.registerCommand(graph);

		this.registerCommand(addInvites);
		this.registerCommand(clearInvites);
		this.registerCommand(createInvite);
		this.registerCommand(info);
		this.registerCommand(inviteCodes);
		this.registerCommand(inviteDetails);
		this.registerCommand(invites);
		this.registerCommand(leaderboard);
		this.registerCommand(removeInvites);
		this.registerCommand(restoreInvites);
		this.registerCommand(subtractFakes);
		this.registerCommand(subtractLeaves);

		this.registerCommand(exportLeaderboard);

		this.registerCommand(addRank);
		this.registerCommand(fixRanks);
		this.registerCommand(ranks);
		this.registerCommand(removeRank);
	}
}
