import { Member, Message } from 'eris';
import moment, { Duration } from 'moment';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { MemberResolver, StringResolver } from '../../../../framework/resolvers';
import { PunishmentType } from '../../../../models/PunishmentConfig';
import { ScheduledActionType } from '../../../../models/ScheduledAction';
import { CommandGroup, ModerationCommand } from '../../../../types';

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
					name: 'reason',
					resolver: StringResolver,
					rest: true
				}
			],
			/*flags: [
				{
					name: 'duration',
					resolver: DurationResolver,
					short: 'd'
				}
			],*/
			group: CommandGroup.Moderation,
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetMember, reason]: [Member, string],
		{ duration }: { duration: Duration },
		{ guild, me, settings, t }: Context
	): Promise<any> {
		const embed = this.client.mod.createBasicEmbed(targetMember);

		const mutedRole = settings.mutedRole;

		if (!mutedRole || !guild.roles.has(mutedRole)) {
			embed.description = t('cmd.mute.missingRole');
		} else if (this.client.mod.isPunishable(guild, targetMember, message.member, me)) {
			await this.client.mod.informAboutPunishment(targetMember, PunishmentType.mute, settings, { reason });

			try {
				await targetMember.addRole(mutedRole, reason);

				// Make sure member exists in DB
				await this.client.repo.member.save({
					id: targetMember.user.id,
					name: targetMember.user.username,
					discriminator: targetMember.user.discriminator
				});

				const punishment = await this.client.repo.punishment.save({
					guildId: guild.id,
					memberId: targetMember.id,
					type: PunishmentType.mute,
					amount: 0,
					args: '',
					reason: reason,
					creatorId: message.author.id
				});

				await this.client.mod.logPunishmentModAction(
					guild,
					targetMember.user,
					punishment.type,
					punishment.amount,
					[{ name: 'Reason', value: reason }],
					message.author
				);

				if (duration) {
					await this.client.scheduler.addScheduledAction(
						guild.id,
						ScheduledActionType.unmute,
						{ memberId: targetMember.id },
						moment()
							.add(duration)
							.toDate(),
						'Unmute from timed mute command'
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
