import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import {
	MemberResolver,
	StringResolver
} from '../../../resolvers';
import { CommandGroup, ModerationCommand, Permissions } from '../../../types';
import { getHighestRole, to } from '../../../util';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.unban,
			aliases: [],
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

		let highestBotRole = getHighestRole(guild, me.roles);
		let highestMemberRole = getHighestRole(guild, member.roles);
		let highestAuthorRole = getHighestRole(guild, message.member.roles);

		if (me.permission.has(Permissions.BAN_MEMBERS)) {
			embed.description =
				'I need the `Ban Members` permission to use this command';
		} else if (
			member.id !== guild.ownerID &&
			member.id !== me.user.id &&
			highestBotRole.position > highestMemberRole.position &&
			highestAuthorRole.position > highestMemberRole.position
		) {
			let [error] = await to(member.unban(reason));
			if (error) {
				embed.description = t('cmd.unban.error');
			} else {
				embed.description = t('cmd.unban.done');
			}
		} else {
			embed.description = t('cmd.unban.canNotUnban');
		}

		let response = await this.client.sendReply(message, embed) as Message;

		if (settings.modPunishmentBanDeleteMessage) {
			const func = () => {
				message.delete();
				response.delete();
			};
			setTimeout(func, 4000);
		}
	}
}
