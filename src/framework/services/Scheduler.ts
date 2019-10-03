import moment from 'moment';

import { IMClient } from '../../client';
import { ScheduledAction, ScheduledActionType } from '../../models/ScheduledAction';

export class SchedulerService {
	private client: IMClient = null;
	private scheduledActionTimers: Map<number, NodeJS.Timer>;
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
		const action = await this.client.repo.scheduledAction.save(
			this.client.repo.scheduledAction.create({
				guildId: guildId,
				actionType: actionType,
				args: args,
				date: date,
				reason: reason
			})
		);
		this.createTimer(action);
	}

	public async cancelScheduledAction(actionId: number) {
		await this.client.repo.scheduledAction.update({ id: actionId }, { deletedAt: new Date() });
		await this.removeTimer(actionId);
	}

	private createTimer(action: ScheduledAction) {
		const millisUntilAction = moment(action.date).diff(moment(), 'milliseconds');
		const func = () => this.scheduledActionFunctions[action.actionType](action.args);
		const timer = setTimeout(func, millisUntilAction);
		this.scheduledActionTimers.set(action.id, timer);
	}

	private async removeTimer(actionId: number) {
		const timer = this.scheduledActionTimers.get(actionId);
		clearTimeout(timer);
		this.scheduledActionTimers.delete(actionId);
	}

	private async scheduleScheduledActions() {
		const actions = await this.client.repo.scheduledAction.find({
			where: { guildId: this.client.guilds.map(g => g.id) }
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
