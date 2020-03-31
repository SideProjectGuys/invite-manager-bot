import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { NumberResolver } from '../../../framework/resolvers';
import { CommandGroup, GuildPermission, ModerationCommand } from '../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.cleanShort,
			aliases: ['clean-short', 'clearShort', 'clear-short'],
			args: [
				{
					name: 'maxTextLength',
					resolver: NumberResolver,
					required: true
				},
				{
					name: 'numberOfMessages',
					resolver: NumberResolver
				}
			],
			group: CommandGroup.Moderation,
			botPermissions: [GuildPermission.READ_MESSAGE_HISTORY, GuildPermission.MANAGE_MESSAGES],
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[maxTextLength, numberOfMessages]: [number, number],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		const embed = this.createEmbed();

		if (numberOfMessages < 1) {
			return this.sendReply(message, t('cmd.clean.invalidQuantity'));
		}
		if (numberOfMessages === undefined) {
			numberOfMessages = 5;
		}

		const messages = await message.channel.getMessages(Math.min(numberOfMessages, 100), message.id);

		const messagesToBeDeleted = messages.filter((msg) => {
			return msg.content.length < maxTextLength && msg.attachments.length === 0 && msg.embeds.length === 0;
		});

		messagesToBeDeleted.push(message);
		try {
			await this.client.deleteMessages(
				message.channel.id,
				messagesToBeDeleted.map((m) => m.id)
			);

			embed.title = t('cmd.clean.title');
			embed.description = t('cmd.clean.text', {
				amount: `**${messagesToBeDeleted.length}**`
			});
		} catch (error) {
			embed.title = t('cmd.clean.error');
			embed.description = error;
		}

		const response = await this.sendReply(message, embed);
		if (response) {
			const func = () => response.delete().catch(() => undefined);
			setTimeout(func, 5000);
		}
	}
}
