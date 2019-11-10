import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { MemberResolver, StringResolver } from '../../../framework/resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { PunishmentType } from '../../models/PunishmentConfig';

export default class extends Command {
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
		{ guild, me, settings, t }: Context
	): Promise<any> {
		const embed = this.client.mod.createBasicEmbed(targetMember);

		if (this.client.mod.isPunishable(guild, targetMember, message.member, me)) {
			await this.client.mod.informAboutPunishment(targetMember, PunishmentType.warn, settings, { reason });

			// Make sure member exists in DB
			await this.client.db.saveMembers([
				{
					id: targetMember.user.id,
					name: targetMember.user.username,
					discriminator: targetMember.user.discriminator,
					guildId: guild.id
				}
			]);

			await this.client.db.savePunishment({
				id: null,
				guildId: guild.id,
				memberId: targetMember.id,
				type: PunishmentType.warn,
				amount: 0,
				args: '',
				reason: reason,
				creatorId: message.author.id
			});

			await this.client.mod.logPunishmentModAction(guild, targetMember.user, PunishmentType.warn, 0, [
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
