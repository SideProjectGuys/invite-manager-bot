import crypto from 'crypto';
import moment from 'moment';
import { getRepository, In, Repository } from 'typeorm';

import { IMClient } from '../client';
import {
	ScheduledAction,
	ScheduledActionType
} from '../models/ScheduledAction';

export class Scheduler {
	private client: IMClient = null;
	private scheduledActionTimers: Map<string, any>;
	private scheduledActionFunctions: {
		[k in ScheduledActionType]: (args: any) => void
	};

	private scheduledActionRepo: Repository<ScheduledAction>;

	public constructor(client: IMClient) {
		this.client = client;
		this.scheduledActionRepo = getRepository(ScheduledAction);
		this.scheduledActionTimers = new Map();
		this.scheduledActionFunctions = {
			[ScheduledActionType.unmute]: this.unmute.bind(this)
		};
	}

	public init() {
		this.scheduleScheduledActions();
	}

	public async addScheduledAction(
		guildId: string,
		actionType: ScheduledActionType,
		args: any,
		date: Date,
		reason: string
	) {
		const action = this.scheduledActionRepo.create({
			guildId: guildId,
			actionType: actionType,
			args: args,
			date: date,
			reason: reason
		});
		await this.scheduledActionRepo.insert(action);
		this.createTimer(action);
	}

	public async cancelScheduledAction(
		guildId: string,
		actionType: ScheduledActionType,
		args: any
	) {
		this.scheduledActionRepo.delete({
			guildId: guildId,
			actionType: actionType,
			args: args
		});
		await this.removeTimer(guildId, actionType, args);
	}

	private getActionHash(
		guildId: string,
		actionType: ScheduledActionType,
		args: any
	) {
		const actionString = `${guildId}|${actionType}|${args}`;
		return crypto
			.createHash('md5')
			.update(actionString)
			.digest('hex');
	}

	private createTimer(action: ScheduledAction) {
		const secondsUntilAction = moment(action.date).diff(
			moment(),
			'milliseconds'
		);
		const func = () => {
			this.scheduledActionFunctions[action.actionType](action.args);
		};
		const timeout = setTimeout(func, secondsUntilAction);
		const hash = this.getActionHash(
			action.guildId,
			action.actionType,
			action.args
		);
		this.scheduledActionTimers.set(hash, timeout);
	}

	private async removeTimer(
		guildId: string,
		actionType: ScheduledActionType,
		args: any
	) {
		const hash = this.getActionHash(guildId, actionType, args);
		const timeout = this.scheduledActionTimers.get(hash);
		clearTimeout(timeout);
		this.scheduledActionTimers.delete(hash);
	}

	private async scheduleScheduledActions() {
		const actions = await this.scheduledActionRepo.find({
			where: { guildId: In(this.client.guilds.map(g => g.id)) }
		});
		actions.forEach(action => {
			this.createTimer(action);
		});
	}

	//////////////////////////
	// Scheduler Functions
	//////////////////////////

	private unmute(args: string) {
		console.log('SCHEDULED TASK: UNMUTE', args);
	}
}
