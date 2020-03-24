import { IMService } from '../../framework/services/Service';
import { MusicPlatformType } from '../../types';
import { IHeartRadio } from '../models/iheartradio/IHeartRadio';
import { MusicPlatform } from '../models/MusicPlatform';
import { RaveDJ } from '../models/ravedj/RaveDJ';
import { Soundcloud } from '../models/soundcloud/SoundCloud';
import { TuneInRadio } from '../models/tuneinradio/TuneInRadio';
import { Youtube } from '../models/youtube/Youtube';

export class MusicPlatformService extends IMService {
	private platforms: Map<MusicPlatformType, MusicPlatform> = new Map();

	public async init() {
		this.platforms.set(MusicPlatformType.YouTube, new Youtube(this.client));
		this.platforms.set(MusicPlatformType.SoundCloud, new Soundcloud(this.client));
		this.platforms.set(MusicPlatformType.RaveDJ, new RaveDJ(this.client));
		this.platforms.set(MusicPlatformType.iHeartRADIO, new IHeartRadio(this.client));
		this.platforms.set(MusicPlatformType.TuneIn, new TuneInRadio(this.client));
	}

	public get(platform: MusicPlatformType): MusicPlatform | undefined {
		return this.platforms.get(platform);
	}

	public getForLink(link: string): MusicPlatform | undefined {
		for (const v of this.platforms.values()) {
			if (v.isPlatformUrl(link)) {
				return v;
			}
		}
	}
}
