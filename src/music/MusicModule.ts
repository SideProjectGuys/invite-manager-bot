import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { MusicCache } from './cache/MusicCache';
import './models/GuildSettings';
import { MusicService } from './services/Music';
import { MusicPlatformService } from './services/MusicPlatform';

export class MusicModule extends IMModule {
	public constructor(client: IMClient) {
		super(client);

		this.registerService(MusicService);
		this.registerService(MusicPlatformService);

		this.registerCache(MusicCache);
	}
}
