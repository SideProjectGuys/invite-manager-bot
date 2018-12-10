import { Member, Message } from 'eris';
import { Duration } from 'moment';

import { IMClient } from '../../../client';
import {
	DurationResolver,
	MemberResolver,
	StringResolver
} from '../../../resolvers';
import { punishments, PunishmentType } from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { isPunishable, to } from '../../../util';
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
			strict: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetMember, muteDuration, reason]: [Member, Duration, string],
		flags: {},
		{ guild, me, settings, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.mod.createPunishmentEmbed(
			targetMember.username,
			targetMember.avatarURL
		);

		let mutedRole = settings.mutedRole;

		if (!mutedRole || !guild.roles.has(mutedRole)) {
			embed.description = t('cmd.mute.missingRole');
		} else if (isPunishable(guild, targetMember, message.member, me)) {
			let [error] = await to(targetMember.addRole(mutedRole, reason));
			if (error) {
				console.error(error);
				embed.description = t('cmd.mute.error');
			} else {
				embed.description = t('cmd.mute.done');
				let punishment = await punishments.create({
					id: null,
					guildId: guild.id,
					memberId: targetMember.id,
					punishmentType: PunishmentType.mute,
					amount: 0,
					args: '',
					reason: reason,
					creatorId: message.author.id
				});
				const logEmbed = this.client.mod.createPunishmentEmbed(
					targetMember.username,
					targetMember.avatarURL
				);
				logEmbed.description = `**Punishment ID**: ${punishment.id}\n`;
				logEmbed.description += `**Target**: ${targetMember}\n`;
				logEmbed.description += `**Target**: ${targetMember.username}#${
					targetMember.discriminator
				} (ID: ${targetMember.id})\n`;
				logEmbed.description += `**Action**: ${punishment.punishmentType}\n`;
				logEmbed.description += `**Mod**: ${message.author.username}\n`;
				logEmbed.description += `**Reason**: ${reason}\n`;
				this.client.logModAction(guild, logEmbed);
				/* TODO: Unmute after some time
				await this.client.scheduler.addScheduledAction(
					guild.id,
					ScheduledActionType.unmute,
					{ memberId: member.id },
					muteDuration,
					'');
					*/
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
