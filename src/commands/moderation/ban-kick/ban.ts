import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import {
	MemberResolver,
	NumberResolver,
	StringResolver
} from '../../../resolvers';
import { CommandGroup, ModerationCommand, Permissions } from '../../../types';
import { getHighestRole, to } from '../../../util';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.ban,
			aliases: [],
			args: [
				{
					name: 'user',
					resolver: MemberResolver,
					description: 'User to ban',
					required: true
				},
				{
					name: 'deleteMessageDays',
					resolver: NumberResolver,
					description: 'How far back messages will be deleted (in days)'
				},
				{
					name: 'reason',
					resolver: StringResolver,
					description: 'Why was the user banned',
					rest: true
				}
			],
			desc: 'Ban a member from the server',
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[member, deleteMessageDays, reason]: [Member, number, string],
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
		let highestAuthorRole = getHighestRole(guild, message.member!.roles);

		if (me.permission.has(Permissions.BAN_MEMBERS)) {
			embed.description =
				'I need the `Ban Members` permission to use this command';
		} else if (
			member.id !== guild.ownerID &&
			member.id !== me.user.id &&
			highestBotRole.position > highestMemberRole.position &&
			highestAuthorRole.position > highestMemberRole.position
		) {
			let [error, _] = await to(member.ban(deleteMessageDays, reason));
			if (error) {
				embed.description = t('cmd.ban.error');
			} else {
				embed.description = t('cmd.ban.done');
			}
		} else {
			embed.description = t('cmd.ban.canNotBan');
		}

		let response = await this.client.sendReply(message, embed);

		if (settings.modPunishmentBanDeleteMessage) {
			const func = () => {
				message.delete();
				response.delete();
			};
			setTimeout(func, 4000);
		}
	}
}
