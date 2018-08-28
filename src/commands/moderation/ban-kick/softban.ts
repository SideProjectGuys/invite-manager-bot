import {
	Guild, Member, Message, Role, User,
} from 'eris';
import moment from 'moment';

import { IMClient } from '../../../client';
import { MemberResolver, NumberResolver, StringResolver } from '../../../resolvers';
import {
	punishments,
	strikes
} from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { getHighestRole, to } from '../../../util';
import { Command, Context } from '../../Command';
export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.softban,
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
			desc: 'Check history of a user',
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[member, deleteMessageDays, reason]: [Member, number, string],
		{ guild, me, settings }: Context
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

		if (me.permission.has('BAN_MEMBERS')) {
			embed.description = 'I need the `BAN_MEMBERS` permission to use this command';
		} else if (
			member.id !== guild.ownerID
			&& member.id !== me.user.id
			&& highestBotRole.position > highestMemberRole.position
			&& highestAuthorRole.position > highestMemberRole.position
		) {
			let [error, _] = await to(member.ban(deleteMessageDays, reason));
			if (error) {
				embed.description = `There was an error banning this user:\n${error}`;
			} else {
				[error, _] = await to(member.unban('softban'));
				if (error) {
					embed.description = `The user was but could not be unbanned...\n${error}`;
				} else {
					embed.description = `The user was successfully softbanned.`;
				}
			}
		} else {
			embed.description = `I cannot ban this user.`;
		}

		let response = await this.client.sendReply(message, embed);

		if (settings.modPunishmentSoftbanDeleteMessage) {
			setTimeout(
				() => {
					message.delete();
					response.delete();
				},
				4000);
		}
	}

}
