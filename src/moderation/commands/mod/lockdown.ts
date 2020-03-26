import { Channel, Message, PermissionOverwrite, Role, TextChannel } from 'eris';
import moment, { Duration } from 'moment';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { ScheduledActionType } from '../../../framework/models/ScheduledAction';
import { ChannelResolver, DurationResolver } from '../../../framework/resolvers';
import { CommandGroup, GuildPermission, ModerationCommand } from '../../../types';

const SEND_MESSAGES = 0x00000800;
const NOT_SEND_MESSAGES = 0x7ffff7ff;

// tslint:disable: no-bitwise
export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.lockdown,
			aliases: [],
			args: [
				{
					name: 'channel',
					resolver: ChannelResolver,
					required: false
				}
			],
			flags: [
				{
					name: 'timeout',
					resolver: DurationResolver,
					short: 't'
				}
			],
			group: CommandGroup.Moderation,
			botPermissions: [GuildPermission.MANAGE_ROLES, GuildPermission.MANAGE_CHANNELS],
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[channel]: [Channel],
		{ timeout }: { timeout: Duration },
		{ guild, me, settings, t }: Context
	): Promise<any> {
		channel = channel || message.channel;

		if (!(channel instanceof TextChannel)) {
			await this.sendReply(message, t('cmd.lockdown.notATextChannel'));
			return;
		}

		const scheduledUnlockActions = await this.client.scheduler.getScheduledActionsOfType(
			guild.id,
			ScheduledActionType.unlock
		);
		const scheduledUnlockAction = scheduledUnlockActions.find((action) => action.args.channelId === channel.id);

		if (scheduledUnlockAction) {
			const override = channel.permissionOverwrites.get(scheduledUnlockAction.args.roleId);
			const newAllow = scheduledUnlockAction.args.wasAllowed ? SEND_MESSAGES : 0;
			await this.client.editChannelPermission(
				scheduledUnlockAction.args.channelId,
				scheduledUnlockAction.args.roleId,
				override ? override.allow | newAllow : newAllow,
				override ? override.deny & NOT_SEND_MESSAGES : 0,
				'role',
				'Channel lockdown'
			);
			await this.client.scheduler.removeScheduledAction(guild.id, scheduledUnlockAction.id);

			await this.sendReply(message, t('cmd.lockdown.channelUnlocked', { channel: `<#${channel.id}>` }));

			return;
		}

		// Get lowest role that has write permissions
		let lowestRole: Role | null = null;
		let lowestOverride: PermissionOverwrite | null = null;
		for (const [id, value] of channel.permissionOverwrites) {
			if (value.type === 'member') {
				continue;
			}

			if ((value.deny & SEND_MESSAGES) === SEND_MESSAGES) {
				continue;
			}

			const role = guild.roles.get(id);
			if (lowestRole && lowestRole.position < role.position) {
				continue;
			}

			lowestRole = role;
			lowestOverride = value;
		}

		if (!lowestRole) {
			await this.sendReply(message, t('cmd.lockdown.noSuitingRoleFound'));
			return;
		}

		// We always add a scheduled actions so that we know what to restore on unlock
		// But if the user didn't specify a timeout then we set it to null so they must do it manually
		await this.client.scheduler.addScheduledAction(
			guild.id,
			ScheduledActionType.unlock,
			{
				channelId: channel.id,
				roleId: lowestRole.id,
				wasAllowed: !!(lowestOverride.allow & SEND_MESSAGES)
			},
			timeout ? moment().add(timeout).toDate() : null,
			'Unlock from `!lockdown` command'
		);

		await this.client.editChannelPermission(channel.id, me.id, SEND_MESSAGES, 0, 'member', 'Channel lockdown');
		await this.client.editChannelPermission(
			channel.id,
			lowestRole.id,
			lowestOverride.allow & NOT_SEND_MESSAGES,
			lowestOverride.deny | SEND_MESSAGES,
			'role',
			'Channel lockdown'
		);

		await this.sendReply(message, t('cmd.lockdown.channelLockedDown', { channel: `<#${channel.id}>` }));
	}
}
