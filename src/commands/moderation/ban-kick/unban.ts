import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { MemberResolver, StringResolver } from '../../../resolvers';
import { CommandGroup, ModerationCommand, Permissions } from '../../../types';
import { isPunishable, to } from '../../../util';
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
			strict: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetMember, reason]: [Member, string],
		{ guild, me, settings, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.mod.createPunishmentEmbed(
			targetMember.username,
			targetMember.avatarURL
		);

		if (me.permission.has(Permissions.BAN_MEMBERS)) {
			embed.description = t('cmd.unban.missingPermissions');
		} else if (isPunishable(guild, targetMember, message.member, me)) {
			let [error] = await to(targetMember.unban(reason));
			if (error) {
				embed.description = t('cmd.unban.error');
			} else {
				embed.description = t('cmd.unban.done');
				const logEmbed = this.client.mod.createPunishmentEmbed(
					targetMember.username,
					targetMember.avatarURL
				);
				logEmbed.description += `**Target**: ${targetMember}\n`;
				logEmbed.description += `**Target**: ${targetMember.username}#${
					targetMember.discriminator
				} (ID: ${targetMember.id})\n`;
				logEmbed.description += `**Action**: Unban\n`;
				logEmbed.description += `**Mod**: ${message.author.username}\n`;
				logEmbed.description += `**Reason**: ${reason}\n`;
				this.client.logModAction(guild, logEmbed);
			}
		} else {
			embed.description = t('cmd.unban.canNotUnban');
		}

		let response = (await this.sendReply(message, embed)) as Message;

		if (settings.modPunishmentBanDeleteMessage) {
			const func = () => {
				message.delete();
				response.delete();
			};
			setTimeout(func, 4000);
		}
	}
}
