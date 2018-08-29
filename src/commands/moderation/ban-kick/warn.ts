import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { MemberResolver, StringResolver } from '../../../resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { getHighestRole, to } from '../../../util';
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
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[member, reason]: [Member, string],
		{ guild, me, settings, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			author: { name: member.username, icon_url: member.avatarURL }
		});

		const highestBotRole = getHighestRole(guild, me.roles);
		const highestMemberRole = getHighestRole(guild, member.roles);
		const highestAuthorRole = getHighestRole(guild, message.member!.roles);

		if (
			member.id !== guild.ownerID &&
			member.id !== me.user.id &&
			highestBotRole.position > highestMemberRole.position &&
			highestAuthorRole.position > highestMemberRole.position
		) {
			const dmChannel = await member.user.getDMChannel();

			const messageToUser = t('cmd.warn.text', {
				guild: guild.name,
				text: reason
			});
			const [error, _] = await to(dmChannel.createMessage(messageToUser));

			if (error) {
				embed.description = t('cmd.warn.canNotDm');
			} else {
				embed.description = t('cmd.warn.done');
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
