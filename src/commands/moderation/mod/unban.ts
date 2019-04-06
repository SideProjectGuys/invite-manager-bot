import { Message } from 'eris';

import { IMClient } from '../../../client';
import { StringResolver, UserResolver } from '../../../resolvers';
import {
	BasicUser,
	CommandGroup,
	ModerationCommand,
	Permissions
} from '../../../types';
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
		[targetUser, reason]: [BasicUser, string],
		flags: {},
		{ guild, me, settings, t }: Context
	): Promise<any> {
		const embed = this.client.mod.createBasicEmbed(targetUser);

		if (!me.permission.has(Permissions.BAN_MEMBERS)) {
			embed.description = t('cmd.unban.missingPermissions');
		} else {
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
				this.client.logModAction(guild, logEmbed);

				embed.description = t('cmd.unban.done');
			}
		}

		const response = await this.sendReply(message, embed);

		if (settings.modPunishmentBanDeleteMessage) {
			const func = () => {
				message.delete().catch(() => undefined);
				response.delete().catch(() => undefined);
			};
			setTimeout(func, 4000);
		}
	}
}
