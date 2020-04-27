import { IMClient } from '../client';
import { IMModule } from '../framework/Module';

import { MusicCache } from './cache/MusicCache';
import disconnect from './commands/music/disconnect';
import lyrics from './commands/music/lyrics';
import mashup from './commands/music/mashup';
import nowPlaying from './commands/music/now-playing';
import pause from './commands/music/pause';
import play from './commands/music/play';
import queue from './commands/music/queue';
import repeat from './commands/music/repeat';
import resume from './commands/music/resume';
import rewind from './commands/music/rewind';
import search from './commands/music/search';
import seek from './commands/music/seek';
import skip from './commands/music/skip';
import volume from './commands/music/volume';
import './models/GuildSettings';
import './models/iheartradio/IHeartRadio';
import './models/ravedj/RaveDJ';
import './models/soundcloud/SoundCloud';
import './models/tuneinradio/TuneInRadio';
import './models/youtube/Youtube';
import { MusicService } from './services/Music';

export class MusicModule extends IMModule {
	public name: string = 'Music';

	public constructor(client: IMClient) {
		super(client);

		// Services
		this.registerService(MusicService);

		// Caches
		this.registerCache(MusicCache);

		// Commands
		this.registerCommand(disconnect);
		this.registerCommand(lyrics);
		this.registerCommand(mashup);
		this.registerCommand(nowPlaying);
		this.registerCommand(pause);
		this.registerCommand(play);
		this.registerCommand(queue);
		this.registerCommand(repeat);
		this.registerCommand(resume);
		this.registerCommand(rewind);
		this.registerCommand(search);
		this.registerCommand(seek);
		this.registerCommand(skip);
		this.registerCommand(volume);
	}
}
