import { Guild } from 'eris';

import { IMClient } from '../../client';
import {
	commandUsage,
	CommandUsageAttributes,
	guilds,
	IncidentAttributes,
	incidents,
	LogAttributes,
	logs,
	members
} from '../../sequelize';
import { BasicUser } from '../../types';

export class DBQueueService {
	private client: IMClient = null;

	private guilds: Set<Guild> = new Set();
	private doneGuilds: Set<String> = new Set();

	private users: Set<BasicUser> = new Set();
	private doneUsers: Set<String> = new Set();

	private logActions: LogAttributes[] = [];
	private cmdUsages: CommandUsageAttributes[] = [];
	private incidents: IncidentAttributes[] = [];

	public constructor(client: IMClient) {
		this.client = client;

		setInterval(() => this.syncDB(), 10000);
	}

	public addLogAction(action: LogAttributes, guild: Guild, user: BasicUser) {
		if (!this.doneGuilds.has(guild.id)) {
			this.guilds.add(guild);
		}

		if (!this.doneUsers.has(user.id)) {
			this.users.add(user);
		}

		this.logActions.push(action);
	}

	public addCommandUsage(
		cmdUsage: CommandUsageAttributes,
		guild: Guild,
		user: BasicUser
	) {
		if (!this.doneGuilds.has(guild.id)) {
			this.guilds.add(guild);
		}

		if (!this.doneUsers.has(user.id)) {
			this.users.add(user);
		}

		this.cmdUsages.push(cmdUsage);
	}

	public addIncident(incident: IncidentAttributes, guild: Guild) {
		if (!this.doneGuilds.has(guild.id)) {
			this.guilds.add(guild);
		}
		this.incidents.push(incident);
	}

	private async syncDB() {
		if (
			this.logActions.length === 0 &&
			this.cmdUsages.length === 0 &&
			this.incidents.length === 0
		) {
			return;
		}

		console.time('syncDB');

		const newGuilds = [...this.guilds.values()];
		this.guilds.clear();
		await guilds.bulkCreate(
			newGuilds.map(guild => ({
				id: guild.id,
				name: guild.name,
				icon: guild.iconURL,
				memberCount: guild.memberCount,
				banReason: null
			})),
			{
				updateOnDuplicate: ['name', 'icon', 'memberCount']
			}
		);
		newGuilds.forEach(g => this.doneGuilds.add(g.id));

		const users = [...this.users.values()];
		this.users.clear();
		await members.bulkCreate(
			users.map(user => ({
				id: user.id,
				name: user.username,
				discriminator: user.discriminator
			})),
			{
				updateOnDuplicate: ['name', 'discriminator']
			}
		);
		users.forEach(u => this.doneUsers.add(u.id));

		await Promise.all([
			logs.bulkCreate(this.logActions).then(() => (this.logActions = [])),
			commandUsage.bulkCreate(this.cmdUsages).then(() => (this.cmdUsages = [])),
			incidents.bulkCreate(this.incidents).then(() => (this.incidents = []))
		]);

		console.timeEnd('syncDB');
	}
}
