import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { StringResolver } from '../../../../framework/resolvers';
import {
	CommandGroup,
	GuildPermission,
	ModerationCommand
} from '../../../../types';

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
			botPermissions: [
				GuildPermission.READ_MESSAGE_HISTORY,
				GuildPermission.MANAGE_MESSAGES
			],
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[untilMessageID]: [string],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		const embed = this.createEmbed({
			title: t('cmd.purgeUntil.title')
		});

		const messages: Message[] = await message.channel.getMessages(
			100,
			undefined,
			untilMessageID
		);

		if (messages.length === 0) {
			embed.description = t('cmd.purgeUntil.none');
			return this.sendReply(message, embed);
		} else if (messages.length > 100) {
			embed.description = t('cmd.purgeUntil.msgNotFound');
			return this.sendReply(message, embed);
		} else {
			try {
				await this.client.deleteMessages(
					message.channel.id,
					messages.map(m => m.id)
				);

				embed.description = t('cmd.purgeUntil.text', {
					amount: `**${messages.length}**`
				});
			} catch (error) {
				embed.title = t('cmd.purgeUntil.error');
				embed.description = JSON.stringify(error);
			}

			const response = await this.sendReply(message, embed);
			if (response) {
				const func = () => response.delete().catch(() => undefined);
				setTimeout(func, 5000);
			}
		}
	}
}
