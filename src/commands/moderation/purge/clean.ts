import { Member, Message } from 'eris';

import { IMClient } from '../../../client';
import { EnumResolver, NumberResolver, UserResolver } from '../../../resolvers';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	sequelize
} from '../../../sequelize';
import { CommandGroup, ModerationCommand } from '../../../types';
import { to } from '../../../util';
import { Command, Context } from '../../Command';

enum CleanType {
	images = 'image',
	links = 'link',
	mentions = 'mention',
	bots = 'bots',
	embeds = 'embeds',
	text = 'text'
}

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.clean,
			aliases: [],
			args: [
				{
					name: 'type',
					resolver: new EnumResolver(client, Object.values(CleanType)),
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
		[type, numberOfMessages]: [CleanType, number],
		{ guild, t }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed();

		if (numberOfMessages < 1) {
			return this.client.sendReply(message, t('cmd.clean.invalidQuantity'));
		}
		let messages = await message.channel.getMessages(
			Math.min(numberOfMessages, 100),
			message.id
		);

		// TODO continue here
		if (type === CleanType.images) {
			message.delete();
		}
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
