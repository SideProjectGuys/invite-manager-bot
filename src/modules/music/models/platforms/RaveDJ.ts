import axios from 'axios';
import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { MusicPlatform, MusicQueueItem } from '../../../../types';

import { Platform } from './PlatformInterface';

export interface Thumbnails {
	standard: string;
	maxres: string;
	medium: string;
	default: string;
	high: string;
}

export interface Medium {
	artist: string;
	id: string;
	provider: string;
	providerId: string;
	thumbnails: Thumbnails;
	title: string;
}

export interface Thumbnails2 {
	360: string;
	480: string;
	720: string;
	default: string;
}

export interface Urls {
	720: string;
	default: string;
	audio: string;
}

export interface Data {
	artist: string;
	createdAt: number;
	duration: number;
	id: string;
	media: Medium[];
	percentageComplete: number;
	stage: string;
	style: string;
	thumbnails: Thumbnails2;
	timeEstimate: number;
	title: string;
	updatedAt: number;
	urls: Urls;
}

export interface RaveDjResponse {
	data: Data;
}

const RAVE_DJ_GOOGLE_KEY = 'AIzaSyCB24TzTgYXl4sXwLyeY8y-XXgm0RX_eRQ';

export interface IdTokenResponse {
	kind: string;
	idToken: string;
	refreshToken: string;
	expiresIn: string;
	localId: string;
}

export class RaveDJ extends Platform {
	private idToken: string;

	public constructor(client: IMClient) {
		super(client);
		this.getIdToken();
	}

	public isPlatformUrl(url: string): boolean {
		return url.startsWith('https://rave.dj');
	}

	public getPlatform(): MusicPlatform {
		return MusicPlatform.RaveDJ;
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

	public async getVideoInfoForUrl(
		message: Message,
		link: string
	): Promise<MusicQueueItem> {
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

		return {
			id,
			title: `${data.artist} - ${data.title}`,
			imageURL: data.thumbnails.default,
			user: message.author,
			link,
			platform: MusicPlatform.RaveDJ,
			duration: Number(data.duration),
			getStream: async () => data.urls.audio,
			extras: [
				{
					name: 'Duration',
					value: this.client.music.formatTime(Number(data.duration))
				},
				{
					name: 'Songs contained',
					value: data.media
						.slice(0, 10)
						.map(
							(medium, index) =>
								`${index}: [${medium.title}](https://youtube.com/watch?v=${
									medium.providerId
								})`
						)
						.join('\n')
				}
			]
		};
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
		console.log(data);

		return data.data.id;
	}
}
