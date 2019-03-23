import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import {
	MemberResolver,
	NumberResolver,
	StringResolver
} from '../../../resolvers';
import { punishments, PunishmentType } from '../../../sequelize';
import { CommandGroup, ModerationCommand, Permissions } from '../../../types';
import { isPunishable, to } from '../../../util';
import { Command, Context } from '../../Command';

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
			strict: true,
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

		if (!me.permission.has(Permissions.BAN_MEMBERS)) {
			embed.description = t('ban.softBan.missingPermissions');
		} else if (isPunishable(guild, targetMember, message.member, me)) {
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

					this.client.mod.logPunishmentModAction(
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

		if (settings.modPunishmentSoftbanDeleteMessage) {
			const func = () => {
				message.delete();
				response.delete();
			};
			setTimeout(func, 4000);
		}
	}
}
