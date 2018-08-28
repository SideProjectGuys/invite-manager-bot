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
			name: ModerationCommand.kick,
			aliases: [],
			args: [
				{
					name: 'member',
					resolver: MemberResolver,
					description: 'Member to kick',
					required: true
				},
				{
					name: 'reason',
					resolver: StringResolver,
					description: 'Why was the user banned',
					rest: true
				}
			],
			desc: 'Kick member',
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[member, reason]: [Member, string],
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

		if (me.permission.has('KICK_MEMBERS')) {
			embed.description = 'I need the `KICK_MEMBERS` permission to kick members';
		} else if (
			member.id !== guild.ownerID
			&& member.id !== me.user.id
			&& highestBotRole.position > highestMemberRole.position
			&& highestAuthorRole.position > highestMemberRole.position
		) {
			let [error, _] = await to(member.kick(reason));
			if (error) {
				embed.description = `There was an error kicking this user:\n${error}`;
			} else {
				embed.description = `The user was successfully kicked.`;
			}
		} else {
			embed.description = `I cannot kick this user.`;
		}

		let response = await this.client.sendReply(message, embed);

		if (settings.modPunishmentKickDeleteMessage) {
			setTimeout(
				() => {
					message.delete();
					response.delete();
				},
				4000);
		}
	}

}
