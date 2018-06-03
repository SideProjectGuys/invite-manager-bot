import { TextChannel } from 'discord.js';

import { IMClient } from '../client';
import {
	commandUsage,
	CommandUsageAttributes,
	LogAttributes,
	logs,
	MemberAttributes,
	members
} from '../sequelize';

const config = require('../../config.json');

export class DBQueue {
	private client: IMClient = null;
	private logActions: LogAttributes[] = [];
	private members: MemberAttributes[] = [];
	private cmdUsages: CommandUsageAttributes[] = [];

	public constructor(client: IMClient) {
		this.client = client;

		setInterval(() => this.syncDB(), 10000);
	}

	public addLogAction(action: LogAttributes, member: MemberAttributes) {
		this.members.push(member);
		this.logActions.push(action);
	}

	public addCommandUsage(
		cmdUsage: CommandUsageAttributes,
		member: MemberAttributes
	) {
		this.members.push(member);
		this.cmdUsages.push(cmdUsage);
	}

	private async syncDB() {
		if (this.logActions.length === 0 && this.cmdUsages.length === 0) {
			return;
		}

		const time = console.time('syncDB');

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
