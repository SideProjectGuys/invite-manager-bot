import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { NumberResolver, UserResolver } from '../../../resolvers';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	sequelize
} from '../../../sequelize';
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
					description: 'How many messages should be deleted',
					required: true
				},
				{
					name: 'member',
					resolver: UserResolver,
					description: 'User whose messages get deleted'
				}
			],
			desc: 'Clean a channel of certain message types',
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
			return this.client.sendReply(message, t('cmd.clean.invalidQuantity'));
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

		message.delete();
		let [error, _] = await to(
			this.client.deleteMessages(message.channel.id, messages.map(m => m.id))
		);
		if (error) {
			embed.title = t('cmd.clean.error');
			embed.description = error;
		} else {
			embed.title = t('cmd.clean.title');
			embed.description = t('cmd.clean.text', {
				amount: `**${messages.length}**`
			});
		}

		let response = (await this.client.sendReply(message, embed)) as Message;

		const func = () => {
			response.delete();
		};
		setTimeout(func, 5000);
	}
}
