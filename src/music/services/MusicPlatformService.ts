import { IMClient } from '../../client';
import { MusicPlatformType } from '../../types';
import { IHeartRadio } from '../models/iheartradio/IHeartRadio';
import { MusicPlatform } from '../models/MusicPlatform';
import { RaveDJ } from '../models/ravedj/RaveDJ';
import { Soundcloud } from '../models/soundcloud/SoundCloud';
import { TuneInRadio } from '../models/tuneinradio/TuneInRadio';
import { Youtube } from '../models/youtube/Youtube';

export class MusicPlatformService {
	private client: IMClient;
	private platforms: Map<MusicPlatformType, MusicPlatform> = new Map();

	public constructor(client: IMClient) {
		this.client = client;

		this.platforms.set(MusicPlatformType.YouTube, new Youtube(client));
		this.platforms.set(MusicPlatformType.SoundCloud, new Soundcloud(client));
		this.platforms.set(MusicPlatformType.RaveDJ, new RaveDJ(client));
		this.platforms.set(MusicPlatformType.iHeartRADIO, new IHeartRadio(client));
		this.platforms.set(MusicPlatformType.TuneIn, new TuneInRadio(client));
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
