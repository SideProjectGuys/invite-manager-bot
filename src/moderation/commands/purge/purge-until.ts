import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { StringResolver } from '../../../framework/resolvers';
import { CommandGroup, GuildPermission, ModerationCommand } from '../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.purgeUntil,
			aliases: ['purge-until', 'prune-until', 'pruneu', 'purgeu'],
			args: [
				{
					name: 'messageID',
					resolver: StringResolver,
					required: true
				}
			],
			group: CommandGroup.Moderation,
			botPermissions: [GuildPermission.READ_MESSAGE_HISTORY, GuildPermission.MANAGE_MESSAGES],
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(message: Message, [untilMessageID]: [string], flags: {}, { guild, t }: Context): Promise<any> {
		const embed = this.createEmbed({
			title: t('cmd.purgeUntil.title'),
			description: t('cmd.purgeUntil.inProgress')
		});

		const response = await this.sendReply(message, embed);

		let amount = 0;
		let messages: Message[];
		while (!messages || messages.length > 1) {
			messages = await message.channel.getMessages(1000, undefined, untilMessageID);

			try {
				await this.client.deleteMessages(
					message.channel.id,
					messages.filter((m) => m.id !== response.id).map((m) => m.id)
				);

				amount += messages.length;
			} catch {
				break;
			}
		}

		embed.description = t('cmd.purgeUntil.text', {
			amount: `**${amount}**`
		});
		await response.edit({ embed });

		const func = () => response.delete().catch(() => undefined);
		setTimeout(func, 5000);
	}
}
