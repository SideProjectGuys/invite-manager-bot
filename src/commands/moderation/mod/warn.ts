import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { MemberResolver, StringResolver } from '../../../resolvers';
import { punishments, PunishmentType } from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { isPunishable } from '../../../util';
import { Command, Context } from '../../Command';

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
			strict: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetMember, reason]: [Member, string],
		flags: {},
		{ guild, me, settings, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.mod.createBasicEmbed(targetMember);

		if (isPunishable(guild, targetMember, message.member, me)) {
			await this.client.mod.informAboutPunishment(
				targetMember,
				PunishmentType.warn,
				settings,
				{ reason }
			);

			const punishment = await punishments.create({
				id: null,
				guildId: guild.id,
				memberId: targetMember.id,
				type: PunishmentType.warn,
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
				[
					{ name: 'Mod', value: `<@${message.author.id}>` },
					{ name: 'Reason', value: reason }
				]
			);

			embed.description = t('cmd.warn.done');
		} else {
			embed.description = t('cmd.warn.canNotWarn');
		}

		const response = await this.sendReply(message, embed);

		if (settings.modPunishmentWarnDeleteMessage) {
			const func = () => {
				message.delete();
				response.delete();
			};
			setTimeout(func, 4000);
		}
	}
}
