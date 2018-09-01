import { Message } from 'eris';

import { IMClient } from '../../../client';
import { NumberResolver, StringResolver } from '../../../resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { to } from '../../../util';
import { Command, Context } from '../../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.cleanText,
			aliases: ['clean-text', 'clearText', 'clear-text'],
			args: [
				{
					name: 'text',
					resolver: StringResolver,
					required: true
				},
				{
					name: 'numberOfMessages',
					resolver: NumberResolver,
				}
			],
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		[text, numberOfMessages]: [string, number],
		{ guild, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed();

		if (numberOfMessages < 1) {
			return this.client.sendReply(message, t('cmd.clean.invalidQuantity'));
		}
		if (numberOfMessages === undefined) {
			numberOfMessages = 5;
		}

		let messages = await message.channel.getMessages(
			Math.min(numberOfMessages, 100),
			message.id
		);

		let searchStrings = text.split('+');
		let messagesToBeDeleted = messages.filter(msg => {
			return searchStrings.some(s => msg.content.includes(s));
		});

		let [error] = await to(
			this.client.deleteMessages(message.channel.id, messagesToBeDeleted.map(m => m.id))
		);

		if (error) {
			embed.title = t('cmd.clean.error');
			embed.description = error;
		} else {
			embed.title = t('cmd.clean.title');
			embed.description = t('cmd.clean.text', {
				amount: `**${messagesToBeDeleted.length}**`
			});
		}

		let response = (await this.client.sendReply(message, embed));
		message.delete();

		const func = () => {
			response.delete();
		};
		setTimeout(func, 5000);
	}
}
