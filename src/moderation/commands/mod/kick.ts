import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { MemberResolver, StringResolver } from '../../../framework/resolvers';
import { GuildPermission } from '../../../types';
import { ModerationGuildSettings } from '../../models/GuildSettings';
import { PunishmentType } from '../../models/PunishmentConfig';
import { ModerationService } from '../../services/Moderation';
import { PunishmentService } from '../../services/PunishmentService';

export default class extends IMCommand {
	@Service() private mod: ModerationService;
	@Service() private punishment: PunishmentService;

	public constructor(client: IMClient) {
		super(client, {
			name: 'kick',
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
			group: 'Moderation',
			botPermissions: [GuildPermission.KICK_MEMBERS],
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetMember, reason]: [Member, string],
		flags: {},
		{ guild, me, settings, t }: CommandContext<ModerationGuildSettings>
	): Promise<any> {
		const embed = this.mod.createBasicEmbed(targetMember);

		if (this.mod.isPunishable(guild, targetMember, message.member, me)) {
			try {
				await this.punishment.punish(guild, targetMember.user, PunishmentType.kick, 0, {
					user: message.author,
					reason
				});

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
