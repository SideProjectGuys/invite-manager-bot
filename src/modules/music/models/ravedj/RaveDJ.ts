import axios from 'axios';

import { IMClient } from '../../../../client';
import { MusicPlatformTypes } from '../../../../types';
import { MusicItem } from '../MusicItem';
import { MusicPlatform } from '../MusicPlatform';

import { RaveDJMusicItem } from './RaveDJMusicItem';
import { Data, IdTokenResponse, RaveDjResponse } from './types';

const RAVE_DJ_GOOGLE_KEY = 'AIzaSyCB24TzTgYXl4sXwLyeY8y-XXgm0RX_eRQ';

export class RaveDJ extends MusicPlatform {
	public supportsRewind: boolean = true;
	public supportsSeek: boolean = true;
	public supportsLyrics: boolean = false;
	public supportsSearch: boolean = false;

	private idToken: string;

	public constructor(client: IMClient) {
		super(client);
		this.getIdToken();
	}

	public isPlatformUrl(url: string): boolean {
		return url.startsWith('https://rave.dj');
	}

	public getType(): MusicPlatformTypes {
		return MusicPlatformTypes.RaveDJ;
	}

	private async getIdToken() {
		const { data } = await axios.post<IdTokenResponse>(
			`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${RAVE_DJ_GOOGLE_KEY}`,
			null,
			{
				headers: {
					Referer: 'https://rave.dj/'
				}
			}
		);
		this.idToken = data.idToken;
	}

	public async getByLink(link: string): Promise<MusicItem> {
		const id = link.substr(link.indexOf('.dj/') + 4);

		const res = await axios.get<RaveDjResponse>(
			`https://api.red.wemesh.ca/ravedj/${id}`,
			{
				headers: {
					authorization: `bearer ${this.idToken}`,
					'client-version': '5.0',
					'wemesh-api-version': '5.0',
					'wemesh-platform': 'Android',
					'content-type': 'application/json'
				}
			}
		);

		const data: Data = res.data.data;

		if (!data) {
			throw new Error('INVALID_PLATFORM_URL');
		}

		return new RaveDJMusicItem(this, {
			id: data.id,
			title: data.title,
			link: `https://rave.dj/${data.id}`,
			imageUrl: data.thumbnails.default,
			artist: data.artist,
			audioUrl: data.urls.audio,
			duration: data.duration,
			medias: data.media
		});
	}

	public search(searchTerm: string, maxResults?: number): Promise<MusicItem[]> {
		throw new Error('Method not implemented.');
	}

	public async mix(video1: string, video2: string): Promise<string> {
		const requestObject: any = {
			style: 'MASHUP',
			title: null,
			media: [
				{
					providerId: video1,
					provider: 'YOUTUBE'
				},
				{
					providerId: video2,
					provider: 'YOUTUBE'
				}
			]
		};

		const options = {
			method: 'POST',
			url: 'https://api.red.wemesh.ca/ravedj',
			data: requestObject,
			headers: {
				authorization: `bearer ${this.idToken}`,
				'client-version': '5.0',
				'wemesh-api-version': '5.0',
				'wemesh-platform': 'Android',
				'content-type': 'application/json'
			}
		};

		const { data } = await axios(options);
		return data.data.id;
	}
}
