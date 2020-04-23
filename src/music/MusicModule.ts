import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { MusicCache } from './cache/MusicCache';
import './models/GuildSettings';
import './models/iheartradio/IHeartRadio';
import './models/ravedj/RaveDJ';
import './models/soundcloud/SoundCloud';
import './models/tuneinradio/TuneInRadio';
import './models/youtube/Youtube';
import { MusicService } from './services/Music';

export class MusicModule extends IMModule {
	public constructor(client: IMClient) {
		super(client);

		this.registerService(MusicService);

		this.registerCache(MusicCache);
	}
}
