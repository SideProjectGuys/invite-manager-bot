import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import {
	NumberResolver,
	StringResolver,
	UserResolver
} from '../../../../framework/resolvers';
import { members, punishments, PunishmentType } from '../../../../sequelize';
import {
	BasicUser,
	CommandGroup,
	GuildPermission,
	ModerationCommand
} from '../../../../types';
import { isPunishable, to } from '../../../../util';

export default class extends Command {
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
		{ guild, me, settings, t }: Context
	): Promise<any> {
		let targetMember = guild.members.get(targetUser.id);
		if (!targetMember) {
			targetMember = await guild
				.getRESTMember(targetUser.id)
				.catch(() => undefined);
		}

		const embed = this.client.mod.createBasicEmbed(targetUser);

		if (
			!targetMember ||
			isPunishable(guild, targetMember, message.member, me)
		) {
			if (targetMember) {
				await this.client.mod.informAboutPunishment(
					targetMember,
					PunishmentType.ban,
					settings,
					{ reason }
				);
			}

			const days = deleteMessageDays ? deleteMessageDays : 0;
			const [error] = await to(
				this.client.banGuildMember(guild.id, targetUser.id, days, reason)
			);

			if (error) {
				embed.description = t('cmd.ban.error', { error });
			} else {
				// Make sure member exists in DB
				await members.insertOrUpdate({
					id: targetMember.user.id,
					name: targetMember.user.username,
					discriminator: targetMember.user.discriminator
				});

				const punishment = await punishments.create({
					id: null,
					guildId: guild.id,
					memberId: targetUser.id,
					type: PunishmentType.ban,
					amount: 0,
					args: '',
					reason: reason,
					creatorId: message.author.id
				});

				this.client.mod.logPunishmentModAction(
					guild,
					targetUser,
					punishment.type,
					punishment.amount,
					[{ name: 'Reason', value: reason }],
					message.author
				);

				embed.description = t('cmd.ban.done');
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
