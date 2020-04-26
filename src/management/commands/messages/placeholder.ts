import { Message } from 'eris';

import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { IMModule } from '../../../framework/Module';
import { StringResolver } from '../../../framework/resolvers';
import { GuildPermission } from '../../../types';
import { ManagementService } from '../../services/ManagementService';

const THUMBS_UP = '👍';

export default class extends IMCommand {
	@Service() private mgmt: ManagementService;

	public constructor(module: IMModule) {
		super(module, {
			name: 'placeholder',
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
			group: 'Management',
			botPermissions: [GuildPermission.MANAGE_MESSAGES],
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(
		message: Message,
		[placeholder]: [string],
		{ edit: messageId }: { edit: string },
		{ t, guild }: CommandContext
	): Promise<any> {
		if (!messageId) {
			if (!placeholder) {
				return this.sendReply(message, t('cmd.placeholder.noMessage'));
			}

			// TODO: Premium can post embed messages
			const newMessage = await this.sendReply(message, placeholder);
			await this.mgmt.saveMessage({
				guildId: guild.id,
				channelId: newMessage.channel.id,
				id: newMessage.id,
				content: newMessage.content,
				embeds: newMessage.embeds
			});

			await message.delete().catch(() => undefined);

			return;
		}

		const dbMessage = await this.mgmt.getMessageById(guild.id, messageId);

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
		await this.mgmt.saveMessage({
			guildId: guild.id,
			channelId: editMessage.channel.id,
			id: editMessage.id,
			content: editMessage.content,
			embeds: editMessage.embeds
		});

		await this.client.addMessageReaction(message.channel.id, message.id, THUMBS_UP);
	}
}
