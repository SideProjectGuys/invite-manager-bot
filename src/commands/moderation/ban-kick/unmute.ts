import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import {
	MemberResolver
} from '../../../resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { getHighestRole, isPunishable, to } from '../../../util';
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
		[targetMember]: [Member],
		{ guild, me, settings, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.mod.createPunishmentEmbed(targetMember.username, targetMember.avatarURL);

		let mutedRole = settings.mutedRole;

		if (mutedRole && guild.roles.has(mutedRole)) {
			embed.description =
				'Muted role not set or does not exist!';
		} else if (isPunishable(guild, targetMember, message.member, me)) {
			let [error] = await to(targetMember.removeRole(mutedRole));
			if (error) {
				embed.description = t('cmd.unmute.error');
			} else {
				embed.description = t('cmd.unmute.done');
				const logEmbed = this.client.mod.createPunishmentEmbed(targetMember.username, targetMember.avatarURL);
				logEmbed.description += `**Target**: ${targetMember}\n`;
				logEmbed.description +=
					`**Target**: ${targetMember.username}#${targetMember.discriminator} (ID: ${targetMember.id})\n`;
				logEmbed.description += `**Action**: Unban\n`;
				logEmbed.description += `**Mod**: ${message.author.username}\n`;
				this.client.logModAction(guild, logEmbed);
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
