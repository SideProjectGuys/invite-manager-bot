import { IMClient } from '../../client';

export abstract class IMService {
	protected client: IMClient = null;

	public constructor(client: IMClient) {
		this.client = client;
	}

	public async init() {
		// NO-OP
	}
	public async onClientReady() {
		this.startupDone();
	}
	protected startupDone() {
		this.client.serviceStartupDone(this);
	}
}
