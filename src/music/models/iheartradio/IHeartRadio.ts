import { Platform } from '../../decorators/Platform';
import { MusicPlatform } from '../MusicPlatform';

import { IHeartMusicItem } from './IHeartMusicItem';

const iheart = require('iheart');

@Platform('iHeartRadio')
export class IHeartRadio extends MusicPlatform {
	public supportsRewind: boolean = false;
	public supportsSeek: boolean = false;
	public supportsLyrics: boolean = false;
	public supportsSearch: boolean = true;

	public isPlatformUrl(url: string): boolean {
		if (!url) {
			return false;
		}
		return url.startsWith('iheart');
	}

	public async getByLink(link: string) {
		const res = await this.search(link, 1);
		return res[0];
	}

	public async search(searchTerm: string, maxResults: number = 10): Promise<IHeartMusicItem[]> {
		const matches = await iheart.search(searchTerm);

		return matches.stations.map(
			(station: any) =>
				new IHeartMusicItem(this, {
					id: null,
					title: station.name,
					imageUrl: station.newlogo,
					link: '',
					station: station
				})
		);
	}
}
