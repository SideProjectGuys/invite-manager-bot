import { IMClient } from '../../../client';
import { MusicPlatform } from '../../../types';

import { IHeartRadio } from './platforms/IHeartRadio';
import { Platform } from './platforms/PlatformInterface';
import { RaveDJ } from './platforms/RaveDJ';
import { Soundcloud } from './platforms/SoundCloud';
import { Youtube } from './platforms/Youtube';

export class MusicPlatformService {
	private client: IMClient;
	private platforms: Map<MusicPlatform, Platform> = new Map();

	public constructor(client: IMClient) {
		this.client = client;

		this.platforms.set(MusicPlatform.YouTube, new Youtube(client));
		this.platforms.set(MusicPlatform.SoundCloud, new Soundcloud(client));
		this.platforms.set(MusicPlatform.RaveDJ, new RaveDJ(client));
		this.platforms.set(MusicPlatform.iHeartRADIO, new IHeartRadio(client));
	}

	public getPlatform(platform: MusicPlatform): Platform | undefined {
		return this.platforms.get(platform);
	}

	public getPlatformForLink(link: string): Platform | undefined {
		for (const v of this.platforms.values()) {
			if (v.isPlatformUrl(link)) {
				return v;
			}
		}
	}
}
