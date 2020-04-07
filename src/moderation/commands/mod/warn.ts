import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { MemberResolver, StringResolver } from '../../../framework/resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { PunishmentType } from '../../models/PunishmentConfig';
import { ModerationService } from '../../services/Moderation';
import { PunishmentService } from '../../services/PunishmentService';

export default class extends IMCommand {
	@Service() private mod: ModerationService;
	@Service() private punishment: PunishmentService;

	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.warn,
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
			await this.punishment.punish(guild, targetMember.user, PunishmentType.warn, 0, { user: message.author, reason });

			embed.description = t('cmd.warn.done');
		} else {
			embed.description = t('cmd.warn.canNotWarn');
		}

		const response = await this.sendReply(message, embed);
		if (response && settings.modPunishmentWarnDeleteMessage) {
			const func = () => {
				message.delete().catch(() => undefined);
				response.delete().catch(() => undefined);
			};
			setTimeout(func, 4000);
		}
	}
}
