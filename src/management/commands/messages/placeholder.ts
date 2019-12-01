import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { StringResolver } from '../../../framework/resolvers';
import { CommandGroup, GuildPermission, ManagementCommand } from '../../../types';

const THUMBS_UP = '👍';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ManagementCommand.placeholder,
			aliases: ['ph'],
			args: [
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
		{ edit: messageId }: { edit: string },
		{ t, guild }: Context
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
				content: newMessage.content,
				embeds: newMessage.embeds
			});

			await message.delete().catch(() => undefined);

			return;
		}

		const dbMessage = await this.client.db.getMessageById(guild.id, messageId);

		if (!dbMessage) {
			return this.sendReply(message, t('cmd.placeholder.noMessageFoundInDatabase'));
		}

		if (!placeholder) {
			// Return current message
			const msg = dbMessage.content || dbMessage.embeds[0];
			await this.sendReply(message, msg);
			return;
		}

		// Edit message
		const embed = this.createEmbed({ description: placeholder });
		const editMessage = await this.client.editMessage(dbMessage.channelId, dbMessage.id, { embed });
		await this.client.db.saveMessage({
			guildId: guild.id,
			channelId: editMessage.channel.id,
			id: editMessage.id,
			content: editMessage.content,
			embeds: editMessage.embeds
		});

		await this.client.addMessageReaction(message.channel.id, message.id, THUMBS_UP);
	}
}
