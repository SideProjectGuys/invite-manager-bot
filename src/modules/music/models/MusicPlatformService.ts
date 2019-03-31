import { MusicPlatform } from '../../../types';

import { IHeartRadio } from './platforms/IHeartRadio';
import { Platform } from './platforms/PlatformInterface';
import { RaveDJ } from './platforms/RaveDJ';
import { Soundcloud } from './platforms/SoundCloud';
import { Youtube } from './platforms/Youtube';

export class MusicPlatformService {
	private platforms: Map<MusicPlatform, Platform> = new Map();

	public constructor() {
		this.platforms.set(MusicPlatform.YouTube, new Youtube());
		this.platforms.set(MusicPlatform.SoundCloud, new Soundcloud());
		this.platforms.set(MusicPlatform.RaveDJ, new RaveDJ());
		this.platforms.set(MusicPlatform.iHeartRADIO, new IHeartRadio());
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
