import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { MemberResolver, StringResolver } from '../../../framework/resolvers';
import { CommandGroup, GuildPermission, ModerationCommand } from '../../../types';
import { PunishmentType } from '../../models/PunishmentConfig';
import { ModerationService } from '../../services/Moderation';

export default class extends IMCommand {
	@Service() private mod: ModerationService;

	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.kick,
			aliases: [],
			args: [
				{
					name: 'member',
					resolver: MemberResolver,
					required: true
				},
				{
					name: 'reason',
					resolver: StringResolver,
					rest: true
				}
			],
			group: CommandGroup.Moderation,
			botPermissions: [GuildPermission.KICK_MEMBERS],
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetMember, reason]: [Member, string],
		flags: {},
		{ guild, me, settings, t }: CommandContext
	): Promise<any> {
		const embed = this.mod.createBasicEmbed(targetMember);

		if (this.mod.isPunishable(guild, targetMember, message.member, me)) {
			await this.mod.informAboutPunishment(targetMember, PunishmentType.kick, settings, { reason });

			try {
				await this.client.kickGuildMember(guild.id, targetMember.id, encodeURIComponent(reason));

				// Make sure member exists in DB
				await this.db.saveMembers([
					{
						id: targetMember.user.id,
						name: targetMember.user.username,
						discriminator: targetMember.user.discriminator,
						guildId: guild.id
					}
				]);

				await this.db.savePunishment({
					guildId: guild.id,
					memberId: targetMember.id,
					type: PunishmentType.kick,
					amount: 0,
					args: '',
					reason: reason,
					creatorId: message.author.id
				});

				await this.mod.logPunishmentModAction(
					guild,
					targetMember.user,
					PunishmentType.kick,
					0,
					[{ name: 'Reason', value: reason }],
					message.author
				);

				embed.description = t('cmd.kick.done');
			} catch (error) {
				embed.description = t('cmd.kick.error', { error });
			}
		} else {
			embed.description = t('cmd.kick.canNotKick');
		}

		const response = await this.sendReply(message, embed);
		if (response && settings.modPunishmentKickDeleteMessage) {
			const func = () => {
				message.delete().catch(() => undefined);
				response.delete().catch(() => undefined);
			};
			setTimeout(func, 4000);
		}
	}
}
