import 'reflect-metadata';

import { MusicPlatform } from '../models/MusicPlatform';
import { MusicService } from '../services/Music';

type Constructor = new (service: MusicService) => MusicPlatform;

export const platforms: Map<string, Constructor> = new Map();

// tslint:disable-next-line: variable-name
export const Platform = (name: string) => {
	return (target: Constructor) => {
		if (platforms.has(name)) {
			throw new Error(`Music platform with name ${name} registered twice`);
		}

		platforms.set(name, target);
	};
};
