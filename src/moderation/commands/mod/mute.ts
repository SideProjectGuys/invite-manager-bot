import { Member, Message } from 'eris';
import moment, { Duration } from 'moment';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { ScheduledActionType } from '../../../framework/models/ScheduledAction';
import { DurationResolver, MemberResolver, StringResolver } from '../../../framework/resolvers';
import { SchedulerService } from '../../../framework/services/Scheduler';
import { CommandGroup, ModerationCommand } from '../../../types';
import { PunishmentType } from '../../models/PunishmentConfig';
import { ModerationService } from '../../services/Moderation';
import { PunishmentService } from '../../services/PunishmentService';

export default class extends IMCommand {
	@Service() private mod: ModerationService;
	@Service() private scheduler: SchedulerService;
	@Service() private punishment: PunishmentService;

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
					name: 'reason',
					resolver: StringResolver,
					rest: true
				}
			],
			flags: [
				{
					name: 'duration',
					resolver: DurationResolver,
					short: 'd'
				}
			],
			group: CommandGroup.Moderation,
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetMember, reason]: [Member, string],
		{ duration }: { duration: Duration },
		{ guild, me, settings, t }: CommandContext
	): Promise<any> {
		const embed = this.mod.createBasicEmbed(targetMember);

		const mutedRole = settings.mutedRole;

		if (!mutedRole || !guild.roles.has(mutedRole)) {
			embed.description = t('cmd.mute.missingRole');
		} else if (this.mod.isPunishable(guild, targetMember, message.member, me)) {
			try {
				await this.punishment.punish(guild, targetMember.user, PunishmentType.mute, 0, {
					user: message.author,
					reason
				});

				if (duration) {
					embed.fields.push({
						name: t('cmd.mute.unmute.title'),
						value: t('cmd.mute.unmute.desecription', { duration: duration.humanize() })
					});
					await this.scheduler.addScheduledAction(
						guild.id,
						ScheduledActionType.unmute,
						{ memberId: targetMember.id, roleId: mutedRole },
						moment().add(duration).toDate(),
						'Unmute from timed `!mute` command'
					);
				}

				embed.description = t('cmd.mute.done');
			} catch (error) {
				embed.description = t('cmd.mute.error', { error });
			}
		} else {
			embed.description = t('cmd.mute.canNotMute');
		}

		const response = await this.sendReply(message, embed);
		if (response && settings.modPunishmentMuteDeleteMessage) {
			const func = () => {
				message.delete().catch(() => undefined);
				response.delete().catch(() => undefined);
			};
			setTimeout(func, 4000);
		}
	}
}
