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
					description: 'Member to warn',
					required: true
				},
				{
					name: 'reason',
					resolver: StringResolver,
					description: 'Why was the user banned',
					rest: true
				}
			],
			desc: 'Warn member',
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

		if (
			member.id !== guild.ownerID &&
			member.id !== me.user.id &&
			highestBotRole.position > highestMemberRole.position &&
			highestAuthorRole.position > highestMemberRole.position
		) {
			let dmChannel = await member.user.getDMChannel();

			let messageToUser = `You have been warned on server ${guild.name}`;
			if (reason) {
				messageToUser += `Reason: ${reason}`;
			}
			let [error, _] = await to(dmChannel.createMessage(messageToUser));

			if (error) {
				embed.description = `User was not able to receive DM:\n${error}`;
			} else {
				embed.description = `The user was successfully warned.`;
			}
		} else {
			embed.description = `I cannot warn this user.`;
		}

		let response = await this.client.sendReply(message, embed);

		if (settings.modPunishmentWarnDeleteMessage) {
			const func = () => {
				message.delete();
				response.delete();
			};
			setTimeout(func, 4000);
		}
	}
}
