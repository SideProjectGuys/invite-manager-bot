import { IMClient } from '../client';
import {
	commandUsage,
	CommandUsageAttributes,
	GuildAttributes,
	guilds,
	LogAttributes,
	logs,
	MemberAttributes,
	members
} from '../sequelize';

export class DBQueue {
	private client: IMClient = null;

	private logActions: LogAttributes[] = [];
	private guilds: GuildAttributes[] = [];
	private members: MemberAttributes[] = [];
	private cmdUsages: CommandUsageAttributes[] = [];

	public constructor(client: IMClient) {
		this.client = client;

		setInterval(() => this.syncDB(), 10000);
	}

	public addLogAction(
		action: LogAttributes,
		guild: GuildAttributes,
		member: MemberAttributes
	) {
		this.guilds.push(guild);
		this.members.push(member);
		this.logActions.push(action);
	}

	public addCommandUsage(
		cmdUsage: CommandUsageAttributes,
		guild: GuildAttributes,
		member: MemberAttributes
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

		await guilds.bulkCreate(this.guilds, {
			updateOnDuplicate: ['name', 'icon', 'memberCount']
		});
		this.guilds = [];

		await members.bulkCreate(this.members, {
			updateOnDuplicate: ['name', 'discriminator']
		});
		this.members = [];

		await logs.bulkCreate(this.logActions);
		this.logActions = [];

		await commandUsage.bulkCreate(this.cmdUsages);
		this.cmdUsages = [];

		console.timeEnd('syncDB');
	}
}
