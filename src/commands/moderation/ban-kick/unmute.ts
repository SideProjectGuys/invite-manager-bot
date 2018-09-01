import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import {
	MemberResolver
} from '../../../resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { getHighestRole, to } from '../../../util';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.unmute,
			aliases: [],
			args: [
				{
					name: 'user',
					resolver: MemberResolver,
					required: true
				}
			],
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[member]: [Member],
		{ guild, me, settings, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			author: { name: member.username, icon_url: member.avatarURL }
		});

		let mutedRole = settings.mutedRole;

		let highestBotRole = getHighestRole(guild, me.roles);
		let highestMemberRole = getHighestRole(guild, member.roles);
		let highestAuthorRole = getHighestRole(guild, message.member.roles);

		if (mutedRole && guild.roles.has(mutedRole)) {
			embed.description =
				'Muted role not set or does not exist!';
		} else if (
			member.id !== guild.ownerID &&
			member.id !== me.user.id &&
			highestBotRole.position > highestMemberRole.position &&
			highestAuthorRole.position > highestMemberRole.position
		) {
			let [error] = await to(member.removeRole(mutedRole));
			if (error) {
				embed.description = t('cmd.unmute.error');
			} else {
				embed.description = t('cmd.unmute.done');
			}
		} else {
			embed.description = t('cmd.unmute.canNotUnmute');
		}

		let response = await this.client.sendReply(message, embed);

		if (settings.modPunishmentMuteDeleteMessage) {
			const func = () => {
				message.delete();
				response.delete();
			};
			setTimeout(func, 4000);
		}
	}
}
