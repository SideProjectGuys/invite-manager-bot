import { Member, Message } from 'eris';

import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { IMModule } from '../../../framework/Module';
import { MemberResolver, NumberResolver, StringResolver } from '../../../framework/resolvers';
import { GuildPermission } from '../../../types';
import { ModerationGuildSettings } from '../../models/GuildSettings';
import { PunishmentType } from '../../models/PunishmentConfig';
import { ModerationService } from '../../services/Moderation';
import { PunishmentService } from '../../services/PunishmentService';

export default class extends IMCommand {
	@Service() private mod: ModerationService;
	@Service() private punishment: PunishmentService;

	public constructor(module: IMModule) {
		super(module, {
			name: 'softBan',
			aliases: ['soft-ban'],
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
					name: 'deleteMessageDays',
					resolver: NumberResolver,
					short: 'd'
				}
			],
			group: 'Moderation',
			botPermissions: [GuildPermission.BAN_MEMBERS],
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetMember, reason]: [Member, string],
		{ deleteMessageDays }: { deleteMessageDays: number },
		{ guild, me, settings, t }: CommandContext<ModerationGuildSettings>
	): Promise<any> {
		const embed = this.mod.createBasicEmbed(targetMember);

		if (this.mod.isPunishable(guild, targetMember, message.member, me)) {
			const days = deleteMessageDays ? deleteMessageDays : 0;
			try {
				await this.punishment.punish(
					guild,
					targetMember.user,
					PunishmentType.softban,
					0,
					{
						user: message.author,
						reason
					},
					[days]
				);

				embed.description = t('cmd.softBan.done');
			} catch (error) {
				embed.description = t('cmd.softBan.error', { error });
			}
		} else {
			embed.description = t('cmd.ban.canNotSoftBan');
		}

		const response = await this.sendReply(message, embed);
		if (response && settings.modPunishmentSoftbanDeleteMessage) {
			const func = () => {
				message.delete().catch(() => undefined);
				response.delete().catch(() => undefined);
			};
			setTimeout(func, 4000);
		}
	}
}
