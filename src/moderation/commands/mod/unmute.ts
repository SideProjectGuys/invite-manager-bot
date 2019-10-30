import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { MemberResolver } from '../../../framework/resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';

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
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetMember]: [Member],
		flags: {},
		{ guild, me, settings, t }: Context
	): Promise<any> {
		const embed = this.client.mod.createBasicEmbed(targetMember);

		const mutedRole = settings.mutedRole;

		if (!mutedRole || !guild.roles.has(mutedRole)) {
			embed.description = t('cmd.unmute.missingRole');
		} else if (this.client.mod.isPunishable(guild, targetMember, message.member, me)) {
			try {
				await targetMember.removeRole(mutedRole);

				const logEmbed = this.client.mod.createBasicEmbed(targetMember);

				const usr = `${targetMember.username}#${targetMember.discriminator} ` + `(ID: ${targetMember.id})`;
				logEmbed.description += `**User**: ${usr}\n`;
				logEmbed.description += `**Action**: unmute\n`;

				logEmbed.fields.push({
					name: 'Mod',
					value: `<@${message.author.id}>`
				});
				await this.client.logModAction(guild, logEmbed);

				embed.description = t('cmd.unmute.done');
			} catch (error) {
				embed.description = t('cmd.unmute.error', { error });
			}
		} else {
			embed.description = t('cmd.unmute.canNotUnmute');
		}

		const response = await this.sendReply(message, embed);
		if (response && settings.modPunishmentMuteDeleteMessage) {
			const func = () => {
				message.delete().catch(() => undefined);
				response.delete().catch(() => undefined);
			};
			setTimeout(func, 4000);
		}
	}
}
