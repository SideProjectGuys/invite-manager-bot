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
			[ScheduledActionType.unmute]: (g, a) => this.unmute(g, a),
			[ScheduledActionType.unlock]: null
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
		if (action.date !== null) {
			this.createTimer(action);
		}
	}

	public async getScheduledActionsOfType(guildId: string, type: ScheduledActionType) {
		return this.client.db.getScheduledActionsForGuildByType(guildId, type);
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
				const scheduledFunc = this.scheduledActionFunctions[action.actionType];
				if (scheduledFunc) {
					await scheduledFunc(guild, action.args);
				}
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

	public async removeScheduledAction(guildId: string, actionId: number) {
		const timer = this.scheduledActionTimers.get(actionId);
		if (timer) {
			clearTimeout(timer);
			this.scheduledActionTimers.delete(actionId);
		}

		await this.client.db.removeScheduledAction(guildId, actionId);
	}

	private async scheduleScheduledActions() {
		let actions = await this.client.db.getScheduledActionsForGuilds(this.client.guilds.map(g => g.id));
		actions = actions.filter(a => a.date !== null);
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

	private async unlock(guild: Guild, { channelId, roleId }: { channelId: string; roleId: string }) {
		console.log('SCHEDULED TASK: UNLOCK', guild.id, channelId, roleId);
	}
}
