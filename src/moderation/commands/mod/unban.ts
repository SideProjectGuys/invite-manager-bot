import { Message, TextChannel } from 'eris';

import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { IMModule } from '../../../framework/Module';
import { StringResolver, UserResolver } from '../../../framework/resolvers';
import { BasicUser, GuildPermission } from '../../../types';
import { ModerationGuildSettings } from '../../models/GuildSettings';
import { ModerationService } from '../../services/Moderation';

export default class extends IMCommand {
	@Service() private mod: ModerationService;

	public constructor(module: IMModule) {
		super(module, {
			name: 'unban',
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
			group: 'Moderation',
			botPermissions: [GuildPermission.BAN_MEMBERS],
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetUser, reason]: [BasicUser, string],
		flags: {},
		{ guild, me, settings, t }: CommandContext<ModerationGuildSettings>
	): Promise<any> {
		const embed = this.mod.createBasicEmbed(targetUser);

		try {
			await guild.unbanMember(targetUser.id, encodeURIComponent(reason));

			const logEmbed = this.mod.createBasicEmbed(message.author);

			const usr = `${targetUser.username}#${targetUser.discriminator} ` + `(${targetUser.id})`;
			logEmbed.description += `**User**: ${usr}\n`;
			logEmbed.description += `**Action**: unban\n`;

			logEmbed.fields.push({
				name: 'Reason',
				value: reason
			});

			const modLogChannelId = settings.modLogChannel;
			if (modLogChannelId) {
				const logChannel = guild.channels.get(modLogChannelId) as TextChannel;
				if (logChannel) {
					await this.msg.sendEmbed(logChannel, embed);
				}
			}

			embed.description = t('cmd.unban.done');
		} catch (error) {
			embed.description = t('cmd.unban.error', { error });
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
