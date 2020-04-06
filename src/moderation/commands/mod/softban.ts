import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { MemberResolver, NumberResolver, StringResolver } from '../../../framework/resolvers';
import { CommandGroup, GuildPermission, ModerationCommand } from '../../../types';
import { PunishmentType } from '../../models/PunishmentConfig';
import { ModerationService } from '../../services/Moderation';

export default class extends IMCommand {
	@Service() private mod: ModerationService;

	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.softBan,
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
			group: CommandGroup.Moderation,
			botPermissions: [GuildPermission.BAN_MEMBERS],
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetMember, reason]: [Member, string],
		{ deleteMessageDays }: { deleteMessageDays: number },
		{ guild, me, settings, t }: CommandContext
	): Promise<any> {
		const embed = this.mod.createBasicEmbed(targetMember);

		if (this.mod.isPunishable(guild, targetMember, message.member, me)) {
			await this.mod.informAboutPunishment(targetMember, PunishmentType.softban, settings, { reason });

			const days = deleteMessageDays ? deleteMessageDays : 0;
			try {
				await targetMember.ban(days, reason);
				await targetMember.unban('softban');

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
					type: PunishmentType.softban,
					amount: 0,
					args: '',
					reason: reason,
					creatorId: message.author.id
				});

				await this.mod.logPunishmentModAction(
					guild,
					targetMember.user,
					PunishmentType.softban,
					0,
					[{ name: 'Reason', value: reason }],
					message.author
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
