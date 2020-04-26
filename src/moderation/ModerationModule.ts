import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { PunishmentCache } from './cache/PunishmentsCache';
import { StrikesCache } from './cache/StrikesCache';
import punishmentConfig from './commands/automod/punishment-config';
import strikeConfig from './commands/automod/strike-config';
import caseDelete from './commands/info/caseDelete';
import caseView from './commands/info/caseView';
import check from './commands/info/check';
import ban from './commands/mod/ban';
import kick from './commands/mod/kick';
import lockdown from './commands/mod/lockdown';
import mute from './commands/mod/mute';
import softban from './commands/mod/softban';
import strike from './commands/mod/strike';
import unban from './commands/mod/unban';
import unhoist from './commands/mod/unhoist';
import unmute from './commands/mod/unmute';
import warn from './commands/mod/warn';
import clean from './commands/purge/clean';
import cleanShort from './commands/purge/clean-short';
import cleanText from './commands/purge/clean-text';
import purge from './commands/purge/purge';
import purgeUntil from './commands/purge/purge-until';
import './models/GuildSettings';
import { AutoModerationService } from './services/AutoModeration';
import { CaptchaService } from './services/Captcha';
import { ModerationService } from './services/Moderation';
import { PunishmentService } from './services/PunishmentService';
import { StrikeService } from './services/StrikeService';

export class ModerationModule extends IMModule {
	public name: string = 'Moderation';

	public constructor(client: IMClient) {
		super(client);

		// Services
		this.registerService(ModerationService);
		this.registerService(StrikeService);
		this.registerService(PunishmentService);
		this.registerService(AutoModerationService);
		this.registerService(CaptchaService);

		// Caches
		this.registerCache(PunishmentCache);
		this.registerCache(StrikesCache);

		// Commands
		this.registerCommand(punishmentConfig);
		this.registerCommand(strikeConfig);

		this.registerCommand(caseDelete);
		this.registerCommand(caseView);
		this.registerCommand(check);

		this.registerCommand(ban);
		this.registerCommand(kick);
		this.registerCommand(lockdown);
		this.registerCommand(mute);
		this.registerCommand(softban);
		this.registerCommand(strike);
		this.registerCommand(unban);
		this.registerCommand(unhoist);
		this.registerCommand(unmute);
		this.registerCommand(warn);

		this.registerCommand(cleanShort);
		this.registerCommand(cleanText);
		this.registerCommand(clean);
		this.registerCommand(purgeUntil);
		this.registerCommand(purge);
	}
}
