import { Message } from 'eris';

import { IMClient } from '../../../client';
import { StringResolver } from '../../../resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { to } from '../../../util';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.purgeUntil,
			aliases: ['purge-until', 'prune-until', 'pruneu', 'purgeu'],
			args: [
				{
					name: 'messageID',
					resolver: StringResolver,
					required: true
				}
			],
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[untilMessageID]: [string],
		{ guild, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed({
			title: t('cmd.purgeUntil.title')
		});

		let messages: Message[] = await message.channel.getMessages(
			100,
			undefined,
			untilMessageID
		);

		if (messages.length === 0) {
			embed.description = t('cmd.purgeUntil.none');
			return this.client.sendReply(message, embed);
		} else if (messages.length > 100) {
			embed.description = t('cmd.purgeUntil.msgNotFound');
			return this.client.sendReply(message, embed);
		} else {
			messages.push(message);
			let [error] = await to(
				this.client.deleteMessages(message.channel.id, messages.map(m => m.id))
			);
			if (error) {
				embed.title = t('cmd.purgeUntil.error');
				embed.description = error;
			} else {
				embed.description = t('cmd.purgeUntil.text', {
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
}
