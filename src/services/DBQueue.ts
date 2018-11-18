import { DeepPartial, getRepository, Repository } from 'typeorm';

import { IMClient } from '../client';
import { CommandUsage } from '../models/CommandUsage';
import { Guild } from '../models/Guild';
import { Log } from '../models/Log';
import { Member } from '../models/Member';

export class DBQueue {
	private client: IMClient = null;
	private guildRepo: Repository<Guild>;
	private memberRepo: Repository<Member>;
	private logRepo: Repository<Log>;
	private cmdUsageRepo: Repository<CommandUsage>;

	private guilds: DeepPartial<Guild>[] = [];
	private members: DeepPartial<Member>[] = [];
	private logActions: DeepPartial<Log>[] = [];
	private cmdUsages: DeepPartial<CommandUsage>[] = [];

	public constructor(client: IMClient) {
		this.client = client;
		this.guildRepo = getRepository(Guild);
		this.memberRepo = getRepository(Member);
		this.logRepo = getRepository(Log);
		this.cmdUsageRepo = getRepository(CommandUsage);

		setInterval(() => this.syncDB(), 10000);
	}

	public addLogAction(
		action: DeepPartial<Log>,
		guild: DeepPartial<Guild>,
		member: DeepPartial<Member>
	) {
		this.guilds.push(guild);
		this.members.push(member);
		this.logActions.push(action);
	}

	public addCommandUsage(
		cmdUsage: DeepPartial<CommandUsage>,
		guild: DeepPartial<Guild>,
		member: DeepPartial<Member>
	) {
		this.guilds.push(guild);
		this.members.push(member);
		this.cmdUsages.push(cmdUsage);
	}

	private async syncDB() {
		if (this.logActions.length === 0 && this.cmdUsages.length === 0) {
			return;
		}

		console.time('syncDB');

		// TODO: updateOnDuplicate: ['name', 'icon', 'memberCount']
		await this.guildRepo.save(this.guilds);
		this.guilds = [];

		// TODO: updateOnDuplicate: ['name', 'discriminator']
		await this.memberRepo.save(this.members);
		this.members = [];

		await this.logRepo.save(this.logActions);
		this.logActions = [];

		await this.cmdUsageRepo.save(this.cmdUsages);
		this.cmdUsages = [];

		console.timeEnd('syncDB');
	}
}
