import crypto from 'crypto';
import moment from 'moment';

import { IMClient } from '../../client';
import { ScheduledActionAttributes, scheduledActions, ScheduledActionType } from '../../sequelize';

export class SchedulerService {
	private client: IMClient = null;
	private scheduledActionTimers: Map<string, any>;
	private scheduledActionFunctions: {
		[k in ScheduledActionType]: (args: any) => void;
	};

	public constructor(client: IMClient) {
		this.client = client;
		this.scheduledActionTimers = new Map();
		this.scheduledActionFunctions = {
			[ScheduledActionType.unmute]: this.unmute.bind(this)
		};
	}

	public async init() {
		await this.scheduleScheduledActions();
	}

	public async addScheduledAction(
		guildId: string,
		actionType: ScheduledActionType,
		args: any,
		date: Date,
		reason: string
	) {
		const action = await scheduledActions.create({
			id: null,
			guildId: guildId,
			actionType: actionType,
			args: args,
			date: date,
			reason: reason
		});
		this.createTimer(action);
	}

	public async cancelScheduledAction(guildId: string, actionType: ScheduledActionType, args: JSON) {
		scheduledActions.destroy({
			where: {
				guildId: guildId,
				actionType: actionType,
				args: args
			}
		});
		await this.removeTimer(guildId, actionType, args);
	}

	private getActionHash(guildId: string, actionType: ScheduledActionType, args: JSON) {
		const actionString = `${guildId}|${actionType}|${args}`;
		return crypto
			.createHash('md5')
			.update(actionString)
			.digest('hex');
	}

	private createTimer(action: ScheduledActionAttributes) {
		const secondsUntilAction = moment(action.date).diff(moment(), 'milliseconds');
		const func = () => {
			this.scheduledActionFunctions[action.actionType](action.args);
		};
		const timeout = setTimeout(func, secondsUntilAction);
		const hash = this.getActionHash(action.guildId, action.actionType, action.args);
		this.scheduledActionTimers.set(hash, timeout);
	}

	private async removeTimer(guildId: string, actionType: ScheduledActionType, args: JSON) {
		const hash = this.getActionHash(guildId, actionType, args);
		const timeout = this.scheduledActionTimers.get(hash);
		clearTimeout(timeout);
		this.scheduledActionTimers.delete(hash);
	}

	private async scheduleScheduledActions() {
		const actions = await scheduledActions.findAll({
			where: { guildId: this.client.guilds.map(g => g.id) },
			raw: true
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
