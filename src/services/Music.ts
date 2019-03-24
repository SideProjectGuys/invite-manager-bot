import { IMClient } from '../client';

export class MusicService {
	private client: IMClient = null;

	public constructor(client: IMClient) {
		this.client = client;
	}
}
