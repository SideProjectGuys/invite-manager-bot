import { captureException, withScope } from '@sentry/node';
import { Guild } from 'eris';
import moment from 'moment';

import { IMClient } from '../../client';
import { ScheduledAction, ScheduledActionType } from '../models/ScheduledAction';

export class SchedulerService {
	private client: IMClient = null;
	private scheduledActionTimers: Map<number, NodeJS.Timer>;
	private scheduledActionFunctions: {
		[k in ScheduledActionType]: (guild: Guild, args: any) => Promise<void>;
	};

	public constructor(client: IMClient) {
		this.client = client;
		this.scheduledActionTimers = new Map();
		this.scheduledActionFunctions = {
			[ScheduledActionType.unmute]: (g, a) => this.unmute(g, a)
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
		const newId = await this.client.db.saveScheduledAction({
			guildId: guildId,
			actionType: actionType,
			args: args,
			date: date,
			reason: reason
		});
		const action = await this.client.db.getScheduledAction(guildId, newId);
		this.createTimer(action);
	}

	private createTimer(action: ScheduledAction) {
		const millisUntilAction = Math.max(1000, moment(action.date).diff(moment(), 'milliseconds'));
		const func = async () => {
			const guild = this.client.guilds.get(action.guildId);
			if (!guild) {
				console.error('COULD NOT FIND GUILD FOR SCHEDULED FUNCTION', action.guildId);
				return;
			}

			try {
				await this.scheduledActionFunctions[action.actionType](guild, action.args);
				await this.client.db.removeScheduledAction(action.guildId, action.id);
			} catch (error) {
				withScope(scope => {
					scope.setExtra('action', JSON.stringify(action));
					captureException(error);
				});
			}
		};
		console.log(`Scheduling timer in ${millisUntilAction} for ${action.id}`);
		const timer = setTimeout(func, millisUntilAction);
		this.scheduledActionTimers.set(action.id, timer);
	}

	private async removeTimer(actionId: number) {
		const timer = this.scheduledActionTimers.get(actionId);
		if (timer) {
			clearTimeout(timer);
			this.scheduledActionTimers.delete(actionId);
		}
	}

	private async scheduleScheduledActions() {
		const actions = await this.client.db.getScheduledActionsForGuilds(this.client.guilds.map(g => g.id));
		console.log(`Scheduling ${actions.length} actions from db`);
		actions.forEach(action => this.createTimer(action));
	}

	//////////////////////////
	// Scheduler Functions
	//////////////////////////

	private async unmute(guild: Guild, { memberId, roleId }: { memberId: string; roleId: string }) {
		console.log('SCHEDULED TASK: UNMUTE', guild.id, memberId);

		let member = guild.members.get(memberId);
		if (!member) {
			member = await guild.getRESTMember(memberId);
		}
		if (!member) {
			console.error('SCHEDULED TASK: UNMUTE: COULD NOT FIND MEMBER', memberId);
			return;
		}

		await member.removeRole(roleId, 'Timed unmute');
	}
}
