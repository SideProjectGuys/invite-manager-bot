import ytdl from 'ytdl-core';

import { IMClient } from '../../../client';
import { MusicPlatformType } from '../../../types';
import { MusicItem } from '../MusicItem';
import { MusicPlatform } from '../MusicPlatform';

import { YoutubeMusicItem } from './YoutubeMusicItem';

export class Youtube extends MusicPlatform {
	public supportsRewind: boolean = true;
	public supportsSeek: boolean = true;
	public supportsLyrics: boolean = true;
	public supportsSearch: boolean = true;

	public constructor(client: IMClient) {
		super(client);
	}

	public isPlatformUrl(url: string): boolean {
		if (!url) {
			return false;
		}
		return url.startsWith('https://youtube.com/');
	}

	public getType(): MusicPlatformType {
		return MusicPlatformType.YouTube;
	}

	public async getByLink(link: string): Promise<MusicItem> {
		const videoInfo = await ytdl.getInfo(link);
		if (!videoInfo) {
			throw new Error('INVALID_PLATFORM_URL');
		}

		return new YoutubeMusicItem(this, {
			id: videoInfo.video_id,
			title: videoInfo.player_response.videoDetails.title,
			link: `https://youtube.com/watch?v=${videoInfo.video_id}`,
			imageUrl: videoInfo.thumbnail_url,
			channel: videoInfo.author.name,
			duration: Number(videoInfo.length_seconds)
		});
	}

	public async search(searchTerm: string, maxResults: number = 10): Promise<Array<MusicItem>> {
		const tracks = await this.service.resolveTracks(`ytsearch:${searchTerm}`);

		return tracks.slice(0, maxResults).map((track) => {
			const id = track.info.identifier;
			return new YoutubeMusicItem(this, {
				id: id,
				title: track.info.title,
				link: `https://youtube.com/watch?v=${id}`,
				imageUrl: `https://img.youtube.com/vi/${id}/default.jpg`,
				channel: track.info.author,
				duration: track.info.length / 1000
			});
		});
	}

	public parseYoutubeDuration(PT: string) {
		let durationInSec = 0;
		const matches = PT.match(/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i);
		const parts = [
			{
				// years
				pos: 1,
				multiplier: 86400 * 365
			},
			{
				// months
				pos: 2,
				multiplier: 86400 * 30
			},
			{
				// weeks
				pos: 3,
				multiplier: 604800
			},
			{
				// days
				pos: 4,
				multiplier: 86400
			},
			{
				// hours
				pos: 5,
				multiplier: 3600
			},
			{
				// minutes
				pos: 6,
				multiplier: 60
			},
			{
				// seconds
				pos: 7,
				multiplier: 1
			}
		];
		for (var i = 0; i < parts.length; i++) {
			if (typeof matches[parts[i].pos] !== 'undefined') {
				durationInSec += parseInt(matches[parts[i].pos], 10) * parts[i].multiplier;
			}
		}
		return durationInSec;
	}
}
