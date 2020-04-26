import { Message } from 'eris';

import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { IMModule } from '../../../framework/Module';
import { NumberResolver, StringResolver, UserResolver } from '../../../framework/resolvers';
import { BasicUser, GuildPermission } from '../../../types';
import { ModerationGuildSettings } from '../../models/GuildSettings';
import { PunishmentType } from '../../models/PunishmentConfig';
import { ModerationService } from '../../services/Moderation';
import { PunishmentService } from '../../services/PunishmentService';

export default class extends IMCommand {
	@Service() private mod: ModerationService;
	@Service() private punishment: PunishmentService;

	public constructor(module: IMModule) {
		super(module, {
			name: 'ban',
			aliases: [],
			args: [
				{
					name: 'user',
					resolver: UserResolver,
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
		[targetUser, reason]: [BasicUser, string],
		{ deleteMessageDays }: { deleteMessageDays: number },
		{ guild, me, settings, t }: CommandContext<ModerationGuildSettings>
	): Promise<any> {
		let targetMember = guild.members.get(targetUser.id);
		if (!targetMember) {
			targetMember = await guild.getRESTMember(targetUser.id).catch(() => undefined);
		}

		const embed = this.mod.createBasicEmbed(targetUser);

		if (!targetMember || this.mod.isPunishable(guild, targetMember, message.member, me)) {
			const days = deleteMessageDays ? deleteMessageDays : 0;
			try {
				await this.punishment.punish(guild, targetUser, PunishmentType.ban, 0, { user: message.author, reason }, [
					days
				]);

				embed.description = t('cmd.ban.done');
			} catch (error) {
				embed.description = t('cmd.ban.error', { error });
			}
		} else {
			embed.description = t('cmd.ban.canNotBan');
		}

		const response = await this.sendReply(message, embed);
		if (response && settings.modPunishmentBanDeleteMessage) {
			const func = () => {
				message.delete().catch(() => undefined);
				response.delete().catch(() => undefined);
			};
			setTimeout(func, 4000);
		}
	}
}
