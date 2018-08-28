import {
	Message
} from 'eris';

import { IMClient } from '../../../client';
import { StringResolver } from '../../../resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { to } from '../../../util';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.purgeUntil,
			aliases: ['prune-until', 'pruneu', 'purgeu'],
			args: [
				{
					name: 'messageID',
					resolver: StringResolver,
					description: 'Last message ID to be deleted',
					required: true
				}
			],
			desc: 'Remove fake invites from all users',
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[untilMessageID]: [string],
		{ guild }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			title: 'Delete Messages'
		});

		let messages: Message[] = (await message.channel.getMessages(
			100,
			undefined,
			message.id
		)).filter((m: Message) => m.id >= untilMessageID);

		if (messages.length === 0) {
			embed.description = `No messages found to delete.`;
			return this.client.sendReply(message, embed);
		} else if (messages.length > 100) {
			embed.description = `Could not find messageID in the last 100 messages.`;
			return this.client.sendReply(message, embed);
		} else {
			message.delete();
			let [error, _] = await to(this.client.deleteMessages(message.channel.id, messages.map(m => m.id)));
			if (error) {
				embed.title = 'Error';
				embed.description = error;
			} else {
				embed.description = `Deleted **${messages.length}** messages.\nThis message will be deleted in 5 seconds.`;
			}

			let response: Message = await this.client.sendReply(message, embed) as Message;
			setTimeout(
				() => {
					response.delete();
				},
				5000);
		}
	}
}
