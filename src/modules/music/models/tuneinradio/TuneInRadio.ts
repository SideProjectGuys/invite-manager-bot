import axios from 'axios';

import { IMClient } from '../../../../client';
import { MusicPlatformTypes } from '../../../../types';
import { MusicItem } from '../MusicItem';
import { MusicPlatform } from '../MusicPlatform';

import { TuneInMusicItem } from './TuneInMusicItem';
import { TuneInRadioStation } from './types';

const BASE_URL = 'https://api.tunein.com/';
const LINK_REGEX = /-(s\d+)\/$/;

export class TuneInRadio extends MusicPlatform {
	public supportsRewind: boolean = false;
	public supportsSeek: boolean = false;
	public supportsLyrics: boolean = false;
	public supportsSearch: boolean = true;

	public constructor(client: IMClient) {
		super(client);
	}

	public isPlatformUrl(url: string): boolean {
		return url.startsWith('tunein');
	}

	public getPlatform(): MusicPlatformTypes {
		return MusicPlatformTypes.iHeartRADIO;
	}

	public async getByLink(link: string): Promise<MusicItem> {
		const matches = LINK_REGEX.exec(link);
		const id = matches[1];

		const res = await axios.get(
			`${BASE_URL}profiles/${id}&formats=mp3,aac,ogg`
		);

		const station: TuneInRadioStation = res.data.Item;

		return new TuneInMusicItem(this, {
			id: station.GuideId,
			title: station.Title,
			imageUrl: station.Image,
			link: station.Actions.Share.ShareUrl,
			description: station.Subtitle
		});
	}

	public async search(
		searchTerm: string,
		maxResults: number = 10
	): Promise<MusicItem[]> {
		const search = encodeURIComponent(searchTerm);

		const res = await axios.get(
			`${BASE_URL}profiles?fullTextSearch=true&formats=mp3,aac,ogg&query=${search}`
		);

		const stations = res.data.Items.find(
			(i: any) => i.ContainerType === 'Stations'
		);

		return stations.Children.slice(0, maxResults).map(
			(station: TuneInRadioStation) =>
				new TuneInMusicItem(this, {
					id: station.GuideId,
					title: station.Title,
					imageUrl: station.Image,
					link: station.Actions.Share.ShareUrl,
					description: station.Subtitle
				})
		);
	}
}
