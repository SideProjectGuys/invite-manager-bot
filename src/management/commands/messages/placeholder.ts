import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { EnumResolver, StringResolver } from '../../../framework/resolvers';
import { CommandGroup, GuildPermission, ManagementCommand } from '../../../types';

enum PlaceholderMode {
	create = 'create',
	edit = 'edit'
}

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ManagementCommand.placeholder,
			aliases: ['ph'],
			args: [
				{
					name: 'mode',
					resolver: new EnumResolver(client, Object.values(PlaceholderMode)),
					required: true
				},
				{
					name: 'message',
					resolver: StringResolver,
					required: false,
					rest: true
				}
			],
			flags: [
				{
					name: 'edit',
					resolver: StringResolver,
					short: 'e'
				}
			],
			group: CommandGroup.Other,
			botPermissions: [GuildPermission.MANAGE_MESSAGES],
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(
		message: Message,
		[placeholder]: [string],
		{ messageId }: { messageId: string },
		{ t, me, guild }: Context
	): Promise<any> {
		if (!messageId) {
			if (!placeholder) {
				return this.sendReply(message, t('cmd.placeholder.noMessage'));
			}

			// TODO: Premium can post embed messages
			const newMessage = await this.sendReply(message, placeholder);
			await this.client.db.saveMessage({
				guildId: guild.id,
				channelId: newMessage.channel.id,
				id: newMessage.id,
				content: newMessage.content
			});

			return;
		}

		const dbMessage = await this.client.db.getMessageById(guild.id, messageId);

		if (!placeholder) {
			// Return current message
			await this.sendReply(message, dbMessage.content);

			return;
		}

		// Edit message
		const embed = this.createEmbed({ description: placeholder });
		await this.client.editMessage(dbMessage.channelId, dbMessage.id, { embed });
	}
}
