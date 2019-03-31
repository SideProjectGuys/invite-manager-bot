import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { MusicPlatform, MusicQueueItem } from '../../../../types';

export interface Platform {
	isPlatformUrl(url: string): boolean;
	getPlatform(): MusicPlatform;
	getVideoInfoForUrl(
		client: IMClient,
		message: Message,
		link: string
	): Promise<MusicQueueItem>;
}
