import crypto from 'crypto';
import moment from 'moment';

import { IMClient } from '../client';
import {
	ScheduledActionInstance,
	scheduledActions,
	ScheduledActionType,
} from '../sequelize';

export class Scheduler {
	private client: IMClient = null;
	private scheduledActionTimers: Map<string, any>;
	private scheduledActionFunctions: { [k in ScheduledActionType]: (args: JSON) => void };

	public constructor(client: IMClient) {
		this.client = client;
		this.scheduledActionTimers = new Map();
		this.scheduledActionFunctions = {
			[ScheduledActionType.unmute]: this.unmute.bind(this)
		};
		this.scheduleScheduledActions();
	}

	public async addScheduledAction(
		guildId: string,
		actionType: ScheduledActionType,
		args: JSON,
		date: Date,
		reason: string
	) {
		let action = await scheduledActions.create({
			id: null,
			guildId: guildId,
			actionType: actionType,
			args: args,
			date: date,
			reason: reason
		});
		this.createTimer(action);
	}

	public async cancelScheduledAction(
		guildId: string,
		actionType: ScheduledActionType,
		args: JSON
	) {
		scheduledActions.destroy({
			where: {
				guildId: guildId,
				actionType: actionType,
				args: args
			}
		});
		await this.removeTimer(guildId, actionType, args);
	}

	private getActionHash(
		guildId: string,
		actionType: ScheduledActionType,
		args: JSON,
	) {
		let actionString = `${guildId}|${actionType}|${args}`;
		return crypto.createHash('md5').update(actionString).digest('hex');
	}

	private createTimer(
		action: ScheduledActionInstance
	) {
		let secondsUntilAction = moment(action.date).diff(moment(), 'milliseconds');
		let timeout = setTimeout(
			() => {
				this.scheduledActionFunctions[action.actionType](action.args);
			},
			secondsUntilAction);
		let hash = this.getActionHash(action.guildId, action.actionType, action.args);
		this.scheduledActionTimers.set(hash, timeout);
	}

	private async removeTimer(
		guildId: string,
		actionType: ScheduledActionType,
		args: JSON,
	) {
		let hash = this.getActionHash(guildId, actionType, args);
		let timeout = this.scheduledActionTimers.get(hash);
		clearTimeout(timeout);
		this.scheduledActionTimers.delete(hash);
	}

	private async scheduleScheduledActions() {
		let actions = await scheduledActions.findAll({
			where: {
				guildId: this.client.guilds.map(g => g.id)
			}
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
