import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { NumberResolver, UserResolver } from '../../../resolvers';
import { ModerationCommand } from '../../../types';
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
					name: 'member',
					resolver: UserResolver
				}
			],
			strict: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[quantity, member]: [number, Member],
		{ guild, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed();

		if (quantity < 1) {
			return this.client.sendReply(message, t('cmd.purge.invalidQuantity'));
		}

		let messages: Message[];
		if (member) {
			messages = (await message.channel.getMessages(
				Math.min(quantity, 100),
				message.id
			)).filter((a: Message) => a.author.id === member.id);
		} else {
			messages = await message.channel.getMessages(
				Math.min(quantity, 100),
				message.id
			);
		}
		messages.push(message);
		let [error] = await to(
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

		let response = await this.client.sendReply(message, embed);

		const func = () => {
			response.delete();
		};
		setTimeout(func, 5000);
	}
}
