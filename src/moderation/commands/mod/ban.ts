import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { NumberResolver, StringResolver, UserResolver } from '../../../framework/resolvers';
import { BasicUser, CommandGroup, GuildPermission, ModerationCommand } from '../../../types';
import { PunishmentType } from '../../models/PunishmentConfig';
import { ModerationService } from '../../services/Moderation';

export default class extends IMCommand {
	@Service() private mod: ModerationService;

	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.ban,
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
			group: CommandGroup.Moderation,
			botPermissions: [GuildPermission.BAN_MEMBERS],
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetUser, reason]: [BasicUser, string],
		{ deleteMessageDays }: { deleteMessageDays: number },
		{ guild, me, settings, t }: CommandContext
	): Promise<any> {
		let targetMember = guild.members.get(targetUser.id);
		if (!targetMember) {
			targetMember = await guild.getRESTMember(targetUser.id).catch(() => undefined);
		}

		const embed = this.mod.createBasicEmbed(targetUser);

		if (!targetMember || this.mod.isPunishable(guild, targetMember, message.member, me)) {
			if (targetMember) {
				await this.mod.informAboutPunishment(targetMember, PunishmentType.ban, settings, { reason });
			}

			const days = deleteMessageDays ? deleteMessageDays : 0;
			try {
				await this.client.banGuildMember(guild.id, targetUser.id, days, encodeURIComponent(reason));

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
					memberId: targetUser.id,
					type: PunishmentType.ban,
					amount: 0,
					args: '',
					reason: reason,
					creatorId: message.author.id
				});

				await this.mod.logPunishmentModAction(
					guild,
					targetUser,
					PunishmentType.ban,
					0,
					[{ name: 'Reason', value: reason }],
					message.author
				);

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
