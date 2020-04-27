import { Guild } from 'eris';

import { IMClient } from '../../client';
import { IMModule } from '../Module';

export abstract class IMService {
	protected client: IMClient;
	protected module: IMModule;

	public constructor(module: IMModule) {
		this.module = module;
		this.client = module.client;
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
