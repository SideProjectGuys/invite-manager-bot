import { MusicPlatform } from '../../../types';

import { Platform } from './platforms/PlatformInterface';
import { Youtube } from './platforms/Youtube';

export class PlatformService {
	private platforms: Map<MusicPlatform, Platform>;

	public constructor() {
		this.platforms.set(MusicPlatform.YouTube, new Youtube());
	}

	public getPlatformForLink(link: string): MusicPlatform | undefined {
		for (let [k, v] of this.platforms) {
			if (v.isPlatformUrl(link)) {
				return v.getPlatform();
			}
		}
	}
}
