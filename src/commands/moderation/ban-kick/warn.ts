import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { MemberResolver, StringResolver } from '../../../resolvers';
import { punishments, PunishmentType } from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { isPunishable, to } from '../../../util';
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

		const embed = this.client.mod.createPunishmentEmbed(
			targetMember.username,
			targetMember.avatarURL
		);

		if (isPunishable(guild, targetMember, message.member, me)) {
			const dmChannel = await targetMember.user.getDMChannel();

			const messageToUser = t('cmd.warn.text', {
				guild: guild.name,
				text: reason
			});
			const [error] = await to(dmChannel.createMessage(messageToUser));

			if (error) {
				embed.description = t('cmd.warn.canNotDm');
			} else {
				embed.description = t('cmd.warn.done');
				let punishment = await punishments.create({
					id: null,
					guildId: guild.id,
					memberId: targetMember.id,
					punishmentType: PunishmentType.warn,
					amount: 0,
					args: '',
					reason: reason,
					creatorId: message.author.id
				});
				const logEmbed = this.client.mod.createPunishmentEmbed(
					targetMember.username,
					targetMember.avatarURL
				);
				logEmbed.description = `**Punishment ID**: ${punishment.id}\n`;
				logEmbed.description += `**Target**: ${targetMember}\n`;
				logEmbed.description += `**Target**: ${targetMember.username}#${
					targetMember.discriminator
				} (ID: ${targetMember.id})\n`;
				logEmbed.description += `**Action**: ${punishment.punishmentType}\n`;
				logEmbed.description += `**Mod**: ${message.author.username}\n`;
				logEmbed.description += `**Reason**: ${reason}\n`;
				this.client.logModAction(guild, logEmbed);
			}
		} else {
			embed.description = t('cmd.warn.canNotWarn');
		}

		const response = await this.client.sendReply(message, embed);

		if (settings.modPunishmentWarnDeleteMessage) {
			const func = () => {
				message.delete();
				response.delete();
			};
			setTimeout(func, 4000);
		}
	}
}
