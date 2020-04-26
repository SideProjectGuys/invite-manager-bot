import { Member, Message, TextChannel } from 'eris';

import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { IMModule } from '../../../framework/Module';
import { MemberResolver } from '../../../framework/resolvers';
import { ModerationGuildSettings } from '../../models/GuildSettings';
import { ModerationService } from '../../services/Moderation';

export default class extends IMCommand {
	@Service() private mod: ModerationService;

	public constructor(module: IMModule) {
		super(module, {
			name: 'unmute',
			aliases: [],
			args: [
				{
					name: 'user',
					resolver: MemberResolver,
					required: true
				}
			],
			group: 'Moderation',
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[targetMember]: [Member],
		flags: {},
		{ guild, me, settings, t }: CommandContext<ModerationGuildSettings>
	): Promise<any> {
		const embed = this.mod.createBasicEmbed(targetMember);

		const mutedRole = settings.mutedRole;

		if (!mutedRole || !guild.roles.has(mutedRole)) {
			embed.description = t('cmd.unmute.missingRole');
		} else if (this.mod.isPunishable(guild, targetMember, message.member, me)) {
			try {
				await targetMember.removeRole(mutedRole);

				const logEmbed = this.mod.createBasicEmbed(targetMember);

				const usr = `${targetMember.username}#${targetMember.discriminator} ` + `(ID: ${targetMember.id})`;
				logEmbed.description += `**User**: ${usr}\n`;
				logEmbed.description += `**Action**: unmute\n`;

				logEmbed.fields.push({
					name: 'Mod',
					value: `<@${message.author.id}>`
				});

				const modLogChannelId = settings.modLogChannel;
				if (modLogChannelId) {
					const logChannel = guild.channels.get(modLogChannelId) as TextChannel;
					if (logChannel) {
						await this.msg.sendEmbed(logChannel, embed);
					}
				}

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
