import { Guild } from 'eris';

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

	public async getDiagnose(guild: Guild): Promise<any> {
		// NO-OP
	}
	public getStatus(): any {
		// NO-OP
	}
}
