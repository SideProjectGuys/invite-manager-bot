import { Member, Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import {
	MemberResolver,
	NumberResolver,
	StringResolver
} from '../../../../framework/resolvers';
import { members, punishments, PunishmentType } from '../../../../sequelize';
import {
	CommandGroup,
	GuildPermission,
	ModerationCommand
} from '../../../../types';
import { isPunishable, to } from '../../../../util';

export default class extends Command {
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
		{ guild, me, settings, t }: Context
	): Promise<any> {
		const embed = this.client.mod.createBasicEmbed(targetMember);

		if (isPunishable(guild, targetMember, message.member, me)) {
			await this.client.mod.informAboutPunishment(
				targetMember,
				PunishmentType.softban,
				settings,
				{ reason }
			);

			const days = deleteMessageDays ? deleteMessageDays : 0;
			let [error] = await to(targetMember.ban(days, reason));

			if (error) {
				embed.description = t('cmd.softBan.error', { error });
			} else {
				[error] = await to(targetMember.unban('softban'));

				if (error) {
					embed.description = t('cmd.softBan.unBanError', { error });
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
						memberId: targetMember.id,
						type: PunishmentType.softban,
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

					embed.description = t('cmd.softBan.done');
				}
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
