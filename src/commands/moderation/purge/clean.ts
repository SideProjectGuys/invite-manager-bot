import { Message } from 'eris';

import { IMClient } from '../../../client';
import { EnumResolver, NumberResolver } from '../../../resolvers';
import { CommandGroup, ModerationCommand } from '../../../types';
import { to } from '../../../util';
import { Command, Context } from '../../Command';

enum CleanType {
	images = 'images',
	links = 'links',
	mentions = 'mentions',
	bots = 'bots',
	embeds = 'embeds',
	emojis = 'emojis',
	reacted = 'reacted',
	reactions = 'reactions'
}

export default class extends Command {
	public cleanFunctions: { [k in CleanType]: (messages: Message[]) => Message[] };

	public constructor(client: IMClient) {
		super(client, {
			name: ModerationCommand.clean,
			aliases: ['clear'],
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

		this.cleanFunctions = {
			[CleanType.images]: this.images.bind(this),
			[CleanType.links]: this.links.bind(this),
			[CleanType.mentions]: this.mentions.bind(this),
			[CleanType.bots]: this.bots.bind(this),
			[CleanType.embeds]: this.embeds.bind(this),
			[CleanType.emojis]: this.emojis.bind(this),
			[CleanType.reacted]: this.reacted.bind(this),
			[CleanType.reactions]: this.reacted.bind(this),
		};
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
		if (numberOfMessages === undefined) {
			numberOfMessages = 5;
		}

		let messages = await message.channel.getMessages(
			Math.min(numberOfMessages, 100),
			message.id
		);

		let messagesToBeDeleted = this.cleanFunctions[type](messages);

		let error: any;
		if (type === CleanType.reactions) {
			for (let messageToBeDeleted of messagesToBeDeleted) {
				await messageToBeDeleted.removeReactions();
			}
		} else {
			[error] = await to(
				this.client.deleteMessages(message.channel.id, messagesToBeDeleted.map(m => m.id))
			);
		}
		if (error) {
			embed.title = t('cmd.clean.error');
			embed.description = error;
		} else {
			if (type === CleanType.reactions) {
				embed.title = t('cmd.clean.title');
				embed.description = t('cmd.clean.textReactions', {
					amount: `**${messagesToBeDeleted.length}**`
				});
			} else {
				embed.title = t('cmd.clean.title');
				embed.description = t('cmd.clean.text', {
					amount: `**${messagesToBeDeleted.length}**`
				});
			}
		}

		let response = (await this.client.sendReply(message, embed));
		message.delete();

		const func = () => {
			response.delete();
		};
		setTimeout(func, 5000);
	}

	private images(messages: Message[]): Message[] {
		return messages.filter(message => {
			return message.attachments.length > 0;
		});
	}

	private links(messages: Message[]): Message[] {
		return messages.filter(message => {
			let matches = this.client.mod.getLinks(message);
			return matches && matches.length > 0;
		});
	}

	private mentions(messages: Message[]): Message[] {
		return messages.filter(message => {
			return message.mentionEveryone || message.mentions.length > 0 || message.roleMentions.length > 0;
		});
	}

	private bots(messages: Message[]): Message[] {
		return messages.filter(message => {
			return message.author.bot;
		});
	}

	private embeds(messages: Message[]): Message[] {
		return messages.filter(message => {
			return message.embeds.length > 0;
		});
	}

	private emojis(messages: Message[]): Message[] {
		return messages.filter(message => {
			return this.client.mod.countEmojis(message) > 0;
		});
	}

	private reacted(messages: Message[]): Message[] {
		return messages.filter(message => {
			let reactionsKeys = Object.keys(message.reactions);
			return reactionsKeys.length > 0;
		});
	}
}
