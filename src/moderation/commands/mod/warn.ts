import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { MemberResolver, StringResolver } from '../../../framework/resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { PunishmentType } from '../../models/PunishmentConfig';
import { ModerationService } from '../../services/Moderation';

export default class extends IMCommand {
	@Service() private mod: ModerationService;

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
			await this.mod.informAboutPunishment(targetMember, PunishmentType.warn, settings, { reason });

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
				id: null,
				guildId: guild.id,
				memberId: targetMember.id,
				type: PunishmentType.warn,
				amount: 0,
				args: '',
				reason: reason,
				creatorId: message.author.id
			});

			await this.mod.logPunishmentModAction(guild, targetMember.user, PunishmentType.warn, 0, [
				{ name: 'Mod', value: `<@${message.author.id}>` },
				{ name: 'Reason', value: reason }
			]);

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
