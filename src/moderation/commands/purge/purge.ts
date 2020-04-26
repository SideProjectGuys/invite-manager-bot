import { Message } from 'eris';

import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { IMModule } from '../../../framework/Module';
import { NumberResolver, UserResolver } from '../../../framework/resolvers';
import { BasicUser, GuildPermission } from '../../../types';

export default class extends IMCommand {
	public constructor(module: IMModule) {
		super(module, {
			name: 'purge',
			aliases: ['prune'],
			args: [
				{
					name: 'quantity',
					resolver: NumberResolver,
					required: true
				},
				{
					name: 'user',
					resolver: UserResolver
				}
			],
			group: 'Moderation',
			botPermissions: [GuildPermission.READ_MESSAGE_HISTORY, GuildPermission.MANAGE_MESSAGES],
			defaultAdminOnly: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[quantity, user]: [number, BasicUser],
		flags: {},
		{ guild, t }: CommandContext
	): Promise<any> {
		const embed = this.createEmbed();

		if (quantity < 1) {
			return this.sendReply(message, t('cmd.purge.invalidQuantity'));
		}

		let messages: Message[];
		if (user) {
			messages = (await message.channel.getMessages(Math.min(quantity, 100), message.id)).filter(
				(a: Message) => a.author && a.author.id === user.id
			);
		} else {
			messages = await message.channel.getMessages(Math.min(quantity, 100), message.id);
		}
		messages.push(message);

		try {
			await this.client.deleteMessages(
				message.channel.id,
				messages.map((m) => m.id),
				'purge command'
			);

			embed.title = t('cmd.purge.title');
			embed.description = t('cmd.purge.text', {
				amount: `**${messages.length}**`
			});
		} catch (error) {
			embed.title = t('cmd.purge.error');
			embed.description = error.message;
		}

		const response = await this.sendReply(message, embed);
		if (response) {
			const func = () => response.delete().catch(() => undefined);
			setTimeout(func, 5000);
		}
	}
}
