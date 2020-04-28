import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { GuildSettingsCache } from './cache/GuildSettings';
import { InviteCodeSettingsCache } from './cache/InviteCodeSettings';
import { MemberSettingsCache } from './cache/MemberSettings';
import { PermissionsCache } from './cache/Permissions';
import { PremiumCache } from './cache/Premium';
import botConfig from './commands/config/bot-config';
import config from './commands/config/config';
import inviteCodeConfig from './commands/config/invite-code-config';
import memberConfig from './commands/config/member-config';
import permissions from './commands/config/permissions';
import setup from './commands/config/setup';
import botInfo from './commands/info/bot-info';
import credits from './commands/info/credits';
import getBot from './commands/info/get-bot';
import help from './commands/info/help';
import members from './commands/info/members';
import ping from './commands/info/ping';
import prefix from './commands/info/prefix';
import support from './commands/info/support';
import checkPremium from './commands/premium/check-premium';
import premium from './commands/premium/premium';
import tryPremium from './commands/premium/try-premium';
import './models/BotSettings';
import './models/GuildSettings';
import './models/InviteCodeSettings';
import './models/MemberSettings';
import { CommandsService } from './services/Commands';
import { DatabaseService } from './services/Database';
import { MessagingService } from './services/Messaging';
import { PremiumService } from './services/Premium';
import { RabbitMqService } from './services/RabbitMq';
import { SchedulerService } from './services/Scheduler';
import { SettingsService } from './services/Settings';

export class FrameworkModule extends IMModule {
	public name: string = 'Framework';

	public constructor(client: IMClient) {
		super(client);

		// Services
		this.registerService(CommandsService);
		this.registerService(DatabaseService);
		this.registerService(MessagingService);
		this.registerService(PremiumService);
		this.registerService(RabbitMqService);
		this.registerService(SchedulerService);
		this.registerService(SettingsService);

		// Caches
		this.registerCache(PermissionsCache);
		this.registerCache(PremiumCache);
		this.registerCache(GuildSettingsCache);
		this.registerCache(InviteCodeSettingsCache);
		this.registerCache(MemberSettingsCache);

		// Commands
		this.registerCommand(botConfig);
		this.registerCommand(config);
		this.registerCommand(inviteCodeConfig);
		this.registerCommand(memberConfig);
		this.registerCommand(permissions);
		this.registerCommand(setup);

		this.registerCommand(botInfo);
		this.registerCommand(credits);
		this.registerCommand(getBot);
		this.registerCommand(help);
		this.registerCommand(members);
		this.registerCommand(ping);
		this.registerCommand(prefix);
		this.registerCommand(support);

		this.registerCommand(checkPremium);
		this.registerCommand(premium);
		this.registerCommand(tryPremium);
	}
}
