import {
	Member, Message,
} from 'eris';

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
			desc: 'Remove fake invites from all users',
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[quantity, member]: [number, Member],
		{ guild }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed();

		if (!quantity || quantity < 1) {
			return message.channel.createMessage('You must enter a number of messages to purge.');
		}

		let messages: Message[];
		if (member) {
			messages = (await message.channel.getMessages(Math.min(quantity, 100), message.id))
				.filter((a: Message) => a.author.id === member.id);
		} else {
			messages = (await message.channel.getMessages(
				Math.min(quantity, 100), message.id)
			);
		}

		message.delete();
		let [error, _] = await to(this.client.deleteMessages(message.channel.id, messages.map(m => m.id)));
		if (error) {
			embed.title = 'Error';
			embed.description = error;
		} else {
			embed.title = 'Deleted Messages';
			embed.description = `Deleted **${messages.length}** messages.\nThis message will be deleted in 5 seconds.`;
		}

		let response = await this.client.sendReply(message, embed) as Message;

		setTimeout(
			() => {
				response.delete();
			},
			5000);
	}
}
