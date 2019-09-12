import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { StringResolver, UserResolver } from '../../../../framework/resolvers';
import {
	BasicUser,
	CommandGroup,
	GuildPermission,
	ModerationCommand
} from '../../../../types';
import { to } from '../../../../util';

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
			botPermissions: [GuildPermission.BAN_MEMBERS],
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetUser, reason]: [BasicUser, string],
		flags: {},
		{ guild, me, settings, t }: Context
	): Promise<any> {
		const embed = this.client.mod.createBasicEmbed(targetUser);

		const [error] = await to(guild.unbanMember(targetUser.id, reason));

		if (error) {
			embed.description = t('cmd.unban.error', { error });
		} else {
			const logEmbed = this.client.mod.createBasicEmbed(message.author);

			const usr =
				`${targetUser.username}#${targetUser.discriminator} ` +
				`(${targetUser.id})`;
			logEmbed.description += `**User**: ${usr}\n`;
			logEmbed.description += `**Action**: unban\n`;

			logEmbed.fields.push({
				name: 'Reason',
				value: reason
			});
			await this.client.logModAction(guild, logEmbed);

			embed.description = t('cmd.unban.done');
		}

		const response = await this.sendReply(message, embed);
		if (response && settings.modPunishmentBanDeleteMessage) {
			const func = () => {
				message.delete().catch(() => undefined);
				response.delete().catch(() => undefined);
			};
			setTimeout(func, 4000);
		}
	}
}
