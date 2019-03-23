import { Message } from 'eris';

import { IMClient } from '../../../client';
import { NumberResolver, UserResolver } from '../../../resolvers';
import { BasicUser, ModerationCommand } from '../../../types';
import { to } from '../../../util';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.purge,
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
			strict: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[quantity, user]: [number, BasicUser],
		flags: {},
		{ guild, t }: Context
	): Promise<any> {
		const embed = this.createEmbed();

		if (quantity < 1) {
			return this.sendReply(message, t('cmd.purge.invalidQuantity'));
		}

		let messages: Message[];
		if (user) {
			messages = (await message.channel.getMessages(
				Math.min(quantity, 100),
				message.id
			)).filter((a: Message) => a.author.id === user.id);
		} else {
			messages = await message.channel.getMessages(
				Math.min(quantity, 100),
				message.id
			);
		}
		messages.push(message);
		const [error] = await to(
			this.client.deleteMessages(message.channel.id, messages.map(m => m.id))
		);
		if (error) {
			embed.title = t('cmd.purge.error');
			embed.description = error;
		} else {
			embed.title = t('cmd.purge.title');
			embed.description = t('cmd.purge.text', {
				amount: `**${messages.length}**`
			});
		}

		const response = await this.sendReply(message, embed);

		const func = () => {
			response.delete();
		};
		setTimeout(func, 5000);
	}
}
