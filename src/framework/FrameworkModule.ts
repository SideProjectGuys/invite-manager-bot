import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { GuildSettingsCache } from './cache/GuildSettings';
import { InviteCodeSettingsCache } from './cache/InviteCodeSettings';
import { MemberSettingsCache } from './cache/MemberSettings';
import { PermissionsCache } from './cache/Permissions';
import { PremiumCache } from './cache/Premium';
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
	public constructor(client: IMClient) {
		super(client);

		this.registerService(CommandsService);
		this.registerService(DatabaseService);
		this.registerService(MessagingService);
		this.registerService(PremiumService);
		this.registerService(RabbitMqService);
		this.registerService(SchedulerService);
		this.registerService(SettingsService);

		this.registerCache(PermissionsCache);
		this.registerCache(PremiumCache);
		this.registerCache(GuildSettingsCache);
		this.registerCache(InviteCodeSettingsCache);
		this.registerCache(MemberSettingsCache);
	}
}
