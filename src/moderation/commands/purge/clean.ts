import { Message } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Service } from '../../../framework/decorators/Service';
import { EnumResolver, NumberResolver } from '../../../framework/resolvers';
import { GuildPermission } from '../../../types';
import { ModerationService } from '../../services/Moderation';

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

export default class extends IMCommand {
	@Service() private mod: ModerationService;

	public cleanFunctions: {
		[k in CleanType]: (messages: Message[]) => Message[];
	};

	public constructor(client: IMClient) {
		super(client, {
			name: 'clean',
			aliases: ['clear'],
			args: [
				{
					name: 'type',
					resolver: new EnumResolver(client, Object.values(CleanType)),
					required: true
				},
				{
					name: 'numberOfMessages',
					resolver: NumberResolver
				}
			],
			group: 'Moderation',
			botPermissions: [GuildPermission.READ_MESSAGE_HISTORY, GuildPermission.MANAGE_MESSAGES],
			defaultAdminOnly: true,
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
			[CleanType.reactions]: this.reacted.bind(this)
		};
	}

	public async action(
		message: Message,
		[type, numberOfMessages]: [CleanType, number],
		flags: {},
		{ guild, t }: CommandContext
	): Promise<any> {
		const embed = this.createEmbed();

		if (numberOfMessages < 1) {
			return this.sendReply(message, t('cmd.clean.invalidQuantity'));
		}
		if (numberOfMessages === undefined) {
			numberOfMessages = 5;
		}

		const messages = await message.channel.getMessages(Math.min(numberOfMessages, 100), message.id);

		const messagesToBeDeleted = this.cleanFunctions[type](messages);

		if (type === CleanType.reactions) {
			for (const messageToBeDeleted of messagesToBeDeleted) {
				await messageToBeDeleted.removeReactions().catch(() => undefined);
			}
			message.delete().catch(() => undefined);

			embed.title = t('cmd.clean.title');
			embed.description = t('cmd.clean.textReactions', {
				amount: `**${messagesToBeDeleted.length}**`
			});
		} else {
			messagesToBeDeleted.push(message);

			try {
				await this.client.deleteMessages(
					message.channel.id,
					messagesToBeDeleted.map((m) => m.id)
				);

				embed.title = t('cmd.clean.title');
				embed.description = t('cmd.clean.text', {
					amount: `**${messagesToBeDeleted.length}**`
				});
			} catch (error) {
				embed.title = t('cmd.clean.error');
				embed.description = error.message;
			}
		}

		const response = await this.sendReply(message, embed);
		if (response) {
			const func = () => response.delete().catch(() => undefined);
			setTimeout(func, 5000);
		}
	}

	private images(messages: Message[]): Message[] {
		return messages.filter((message) => {
			return message.attachments.length > 0;
		});
	}

	private links(messages: Message[]): Message[] {
		return messages.filter((message) => {
			const matches = this.mod.getLinks(message);
			return matches && matches.length > 0;
		});
	}

	private mentions(messages: Message[]): Message[] {
		return messages.filter((message) => {
			return message.mentionEveryone || message.mentions.length > 0 || message.roleMentions.length > 0;
		});
	}

	private bots(messages: Message[]): Message[] {
		return messages.filter((message) => {
			return message.author.bot;
		});
	}

	private embeds(messages: Message[]): Message[] {
		return messages.filter((message) => {
			return message.embeds.length > 0;
		});
	}

	private emojis(messages: Message[]): Message[] {
		return messages.filter((message) => {
			return this.mod.countEmojis(message) > 0;
		});
	}

	private reacted(messages: Message[]): Message[] {
		return messages.filter((message) => {
			const reactionsKeys = Object.keys(message.reactions);
			return reactionsKeys.length > 0;
		});
	}
}
