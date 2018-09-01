import { Member, Message } from 'eris';
import { Duration } from 'moment';

import { IMClient } from '../../../client';
import {
	DurationResolver,
	MemberResolver,
	StringResolver
} from '../../../resolvers';
import { ScheduledActionType } from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { getHighestRole, to } from '../../../util';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.mute,
			aliases: [],
			args: [
				{
					name: 'user',
					resolver: MemberResolver,
					required: true
				},
				{
					name: 'muteDuration',
					resolver: DurationResolver
				},
				{
					name: 'reason',
					resolver: StringResolver,
					rest: true
				}
			],
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[member, muteDuration, reason]: [Member, Duration, string],
		{ guild, me, settings, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			author: { name: member.username, icon_url: member.avatarURL }
		});

		let mutedRole = settings.mutedRole;

		let highestBotRole = getHighestRole(guild, me.roles);
		let highestMemberRole = getHighestRole(guild, member.roles);
		let highestAuthorRole = getHighestRole(guild, message.member.roles);

		console.log(mutedRole);
		console.log(guild.roles.has(mutedRole));
		if (!mutedRole || !guild.roles.has(mutedRole)) {
			embed.description =
				'Muted role not set or does not exist!';
		} else if (
			member.id !== guild.ownerID &&
			member.id !== me.user.id &&
			highestBotRole.position > highestMemberRole.position &&
			highestAuthorRole.position > highestMemberRole.position
		) {
			let [error] = await to(member.addRole(mutedRole, reason));
			if (error) {
				console.log(error);
				embed.description = t('cmd.mute.error');
			} else {
				embed.description = t('cmd.mute.done');
				await this.client.scheduler.addScheduledAction(
					guild.id,
					ScheduledActionType.unmute,
					{ memberId: member.id },
					muteDuration,
					'');
			}
		} else {
			embed.description = t('cmd.mute.canNotMute');
		}

		let response = await this.client.sendReply(message, embed);

		if (settings.modPunishmentMuteDeleteMessage) {
			const func = () => {
				message.delete();
				response.delete();
			};
			setTimeout(func, 4000);
		}
	}
}
