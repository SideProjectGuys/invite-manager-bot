import { Message, User } from 'eris';

import { IMClient } from '../../../client';
import { StringResolver, UserResolver } from '../../../resolvers';
import { CommandGroup, ModerationCommand, Permissions } from '../../../types';
import { to } from '../../../util';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.unban,
			aliases: [],
			args: [
				{
					name: 'user',
					resolver: UserResolver,
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
		[targetUser, reason]: [User, string],
		flags: {},
		{ guild, me, settings, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.mod.createPunishmentEmbed(
			targetUser.username,
			targetUser.avatarURL
		);

		if (!me.permission.has(Permissions.BAN_MEMBERS)) {
			embed.description = t('cmd.unban.missingPermissions');
		} else {
			let [error] = await to(guild.unbanMember(targetUser.id, reason));
			if (error) {
				embed.description = t('cmd.unban.error');
			} else {
				embed.description = t('cmd.unban.done');
				const logEmbed = this.client.mod.createPunishmentEmbed(
					targetUser.username,
					targetUser.avatarURL
				);
				logEmbed.description += `**Target**: ${targetUser.username}#${
					targetUser.discriminator
				} (ID: ${targetUser.id})\n`;
				logEmbed.description += `**Action**: Unban\n`;
				logEmbed.description += `**Mod**: ${message.author.username}\n`;
				logEmbed.description += `**Reason**: ${reason}\n`;
				this.client.logModAction(guild, logEmbed);
			}
		}

		let response = (await this.client.sendReply(message, embed)) as Message;

		if (settings.modPunishmentBanDeleteMessage) {
			const func = () => {
				message.delete();
				response.delete();
			};
			setTimeout(func, 4000);
		}
	}
}
