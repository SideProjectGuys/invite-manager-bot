import { captureException, withScope } from '@sentry/node';
import {
	Embed,
	EmbedBase,
	EmbedOptions,
	Emoji,
	Guild,
	GuildChannel,
	Message,
	TextableChannel,
	User
} from 'eris';
import i18n from 'i18n';
import moment from 'moment';

import { IMClient } from '../../client';
import { Permissions, PromptResult } from '../../types';

const upSymbol = '🔺';
const downSymbol = '🔻';
const truthy = new Set(['true', 'on', 'y', 'yes', 'enable']);

function convertEmbedToPlain(embed: EmbedBase) {
	const url = embed.url ? `(${embed.url})` : '';
	const authorUrl =
		embed.author && embed.author.url ? `(${embed.author.url})` : '';

	let fields = '';
	if (embed.fields && embed.fields.length) {
		fields =
			'\n\n' +
			embed.fields.map(f => `**${f.name}**\n${f.value}`).join('\n\n') +
			'\n\n';
	}

	return (
		'**Embedded links are disabled for this channel.\n' +
		'Please tell an admin to enable them in the server settings.**\n\n' +
		(embed.author ? `_${embed.author.name}_ ${authorUrl}\n` : '') +
		(embed.title ? `**${embed.title}** ${url}\n` : '') +
		(embed.description ? embed.description + '\n' : '') +
		fields +
		(embed.footer ? `_${embed.footer.text}_` : '')
	);
}

export type CreateEmbedFunc = (options?: EmbedOptions) => Embed;
export type SendReplyFunc = (
	message: Message,
	reply: EmbedOptions | string
) => Promise<Message>;
export type SendEmbedFunc = (
	target: TextableChannel,
	embed: EmbedOptions | string,
	fallbackUser?: User
) => Promise<Message>;
export type ShowPaginatedFunc = (
	prevMsg: Message,
	page: number,
	maxPage: number,
	render: (page: number, maxPage: number) => Embed
) => Promise<void>;

export class MessagingService {
	private client: IMClient;

	public constructor(client: IMClient) {
		this.client = client;
	}

	public createEmbed(
		options: EmbedOptions = {},
		overrideFooter: boolean = true
	): Embed {
		let color = options.color
			? (options.color as number | string)
			: parseInt('00AE86', 16);
		// Parse colors in hashtag/hex format
		if (typeof color === 'string') {
			const code = color.startsWith('#') ? color.substr(1) : color;
			color = parseInt(code, 16);
		}

		const footer =
			overrideFooter || !options.footer
				? this.getDefaultFooter()
				: options.footer;

		delete options.color;
		return {
			...options,
			type: 'rich',
			color,
			footer,
			fields: options.fields ? options.fields : [],
			timestamp: new Date().toISOString()
		};
	}

	private getDefaultFooter() {
		return {
			text: this.client.user.username,
			icon_url: this.client.user.avatarURL
		};
	}

	public sendReply(message: Message, reply: EmbedOptions | string) {
		return this.sendEmbed(message.channel, reply, message.author);
	}

	public sendEmbed(
		target: TextableChannel,
		embed: EmbedOptions | string,
		fallbackUser?: User
	) {
		const e =
			typeof embed === 'string'
				? this.createEmbed({ description: embed })
				: embed;

		e.fields = e.fields.filter(field => field && field.value);

		const content = convertEmbedToPlain(e);

		return new Promise<Message>((resolve, reject) => {
			// Fallback functions when sending message fails
			const sendDM = (error?: any) => {
				if (!fallbackUser) {
					return undefined;
				}

				return fallbackUser
					.getDMChannel()
					.then(dmChannel => {
						let msg =
							'I encountered an error when trying to send a message. ' +
							'Please report this to a developer:\n```' +
							`${error.message}\n\n${error.message}\`\`\``;

						if (error.code === 50013) {
							const name = this.client.user.username;
							msg =
								`**${name} does not have permissions to post to that channel.\n` +
								`Please allow ${name} to send messages in the <#${target.id}> channel.**\n\n`;
						}

						return dmChannel
							.createMessage(msg)
							.then(resolve)
							.catch(err2 => {
								withScope(scope => {
									if (target instanceof GuildChannel) {
										scope.setUser({ id: target.guild.id });
									}
									scope.setExtra('message', embed);
									scope.setExtra('content', content);
									scope.setExtra('fallbackUser', fallbackUser.id);
									scope.setExtra('dmMessage', msg);
									captureException(err2);
								});
								return undefined;
							});
					})
					.catch(err2 => {
						withScope(scope => {
							if (target instanceof GuildChannel) {
								scope.setUser({ id: target.guild.id });
							}
							scope.setExtra('message', embed);
							scope.setExtra('content', content);
							scope.setExtra('fallbackUser', fallbackUser.id);
							captureException(err2);
						});
						return undefined;
					});
			};

			const sendPlain = (error?: any) => {
				return target
					.createMessage(content)
					.then(resolve)
					.catch(err => {
						withScope(scope => {
							if (target instanceof GuildChannel) {
								scope.setUser({ id: target.guild.id });
							}
							scope.setExtra('message', embed);
							scope.setExtra('content', content);
							captureException(err);
						});

						return sendDM(error);
					});
			};

			if (target instanceof GuildChannel) {
				if (
					!target
						.permissionsOf(this.client.user.id)
						.has(Permissions.SEND_MESSAGES)
				) {
					// If we don't have permission to send messages in the channel use fallback
					return sendDM({ code: 50013 });
				} else if (
					!target
						.permissionsOf(this.client.user.id)
						.has(Permissions.EMBED_LINKS)
				) {
					// If we don't have permissions to embed links try plain content, then fallback
					return sendPlain();
				} else {
					// Otherwise try embed, then plain content, then fallback
					return target
						.createMessage({ embed: e })
						.then(resolve)
						.catch(error => {
							withScope(scope => {
								scope.setUser({ id: target.guild.id });
								scope.setExtra('message', embed);
								captureException(error);
							});

							return sendPlain(error);
						});
				}
			} else {
				return target
					.createMessage({ embed: e })
					.then(resolve)
					.catch(error => {
						withScope(scope => {
							scope.setExtra('message', embed);
							captureException(error);
						});

						return sendPlain(error);
					});
			}
		});
	}

	public async fillTemplate(
		guild: Guild,
		template: string,
		strings?: { [x: string]: string },
		dates?: { [x: string]: moment.Moment | string }
	): Promise<string | Embed> {
		let msg = template;

		if (strings) {
			Object.keys(strings).forEach(
				k => (msg = msg.replace(new RegExp(`{${k}}`, 'g'), strings[k]))
			);
		}

		if (dates) {
			Object.keys(dates).forEach(
				k => (msg = this.fillDatePlaceholder(msg, k, dates[k]))
			);
		}

		try {
			const temp = JSON.parse(msg);
			if (await this.client.cache.premium.get(guild.id)) {
				return this.createEmbed(temp, false);
			} else {
				const lang = (await this.client.cache.settings.get(guild.id)).lang;
				msg +=
					'\n\n' +
					i18n.__({ locale: lang, phrase: 'JOIN_LEAVE_EMBEDS_IS_PREMIUM' });
			}
		} catch (e) {
			//
		}

		return msg;
	}

	private fillDatePlaceholder(
		msg: string,
		name: string,
		value: moment.Moment | string
	) {
		const date = typeof value === 'string' ? value : value.calendar();
		const duration =
			typeof value === 'string'
				? value
				: moment.duration(value.diff(moment())).humanize();
		const timeAgo = typeof value === 'string' ? value : value.fromNow();

		return msg
			.replace(new RegExp(`{${name}:date}`, 'g'), date)
			.replace(new RegExp(`{${name}:duration}`, 'g'), duration)
			.replace(new RegExp(`{${name}:timeAgo}`, 'g'), timeAgo);
	}

	public async prompt(
		message: Message,
		promptStr: string
	): Promise<[PromptResult, Message]> {
		await message.channel.createMessage(promptStr);

		let confirmation: Message;
		const done = (): [PromptResult, Message] => {
			if (!confirmation) {
				return [PromptResult.TIMEOUT, confirmation];
			}
			if (truthy.has(confirmation.content.toLowerCase())) {
				return [PromptResult.SUCCESS, confirmation];
			}
			return [PromptResult.FAILURE, confirmation];
		};

		return new Promise<[PromptResult, Message]>(resolve => {
			const func = async (msg: Message) => {
				if (msg.author.id === message.author.id) {
					confirmation = msg;
					this.client.removeListener('messageCreate', func);
					resolve(done());
				}
			};

			this.client.on('messageCreate', func);

			const timeOut = () => {
				this.client.removeListener('messageCreate', func);
				resolve(done());
			};

			setTimeout(timeOut, 60000);
		});
	}

	public async showPaginated(
		prevMsg: Message,
		page: number,
		maxPage: number,
		render: (page: number, maxPage: number) => Embed,
		author?: User
	) {
		// Create embed for this page
		const embed = render(page, maxPage);

		// Add page number if required
		if (page > 0 || page < maxPage - 1) {
			embed.description = embed.description + `\n\nPage ${page + 1}/${maxPage}`;
		}

		const sudo: boolean = (prevMsg as any).__sudo;

		if (prevMsg.author.id === this.client.user.id) {
			prevMsg.edit({ embed });
			if (!author) {
				throw new Error(
					'Either the message of the original author must be passed, or you must explicitly specify the original author'
				);
			}
		} else {
			author = prevMsg.author;
			prevMsg = await this.sendEmbed(prevMsg.channel, embed, prevMsg.author);
			// If we don't have a message we probably don't have permission
			if (!prevMsg) {
				return;
			}
		}

		// Don't paginate for sudo messages
		if (sudo) {
			return;
		}

		if (page > 0) {
			await prevMsg.addReaction(upSymbol).catch(() => undefined);
		} else {
			const users = await prevMsg
				.getReaction(upSymbol, 10)
				.catch(() => [] as User[]);
			if (users.find(u => u.id === author.id)) {
				prevMsg
					.removeReaction(upSymbol, this.client.user.id)
					.catch(() => undefined);
			}
		}

		if (page < maxPage - 1) {
			await prevMsg.addReaction(downSymbol).catch(() => undefined);
		} else {
			const users = await prevMsg
				.getReaction(downSymbol, 10)
				.catch(() => [] as User[]);
			if (users.find(u => u.id === author.id)) {
				prevMsg
					.removeReaction(downSymbol, this.client.user.id)
					.catch(() => undefined);
			}
		}

		if (page > 0 || page < maxPage - 1) {
			let timer: NodeJS.Timer;

			const func = async (msg: Message, emoji: Emoji, userId: string) => {
				if (msg.id !== prevMsg.id || userId !== author.id) {
					return;
				}
				if (emoji.name !== downSymbol && emoji.name !== upSymbol) {
					return;
				}

				clearInterval(timer);
				this.client.removeListener('messageReactionAdd', func);

				const isUp = emoji.name === upSymbol;
				if (isUp && page > 0) {
					this.showPaginated(prevMsg, page - 1, maxPage, render, author);
				} else if (!isUp && page < maxPage) {
					this.showPaginated(prevMsg, page + 1, maxPage, render, author);
				}
			};

			this.client.on('messageReactionAdd', func);

			const timeOut = () => {
				this.client.removeListener('messageReactionAdd', func);
				prevMsg
					.removeReaction(upSymbol, this.client.user.id)
					.catch(() => undefined);
				prevMsg
					.removeReaction(downSymbol, this.client.user.id)
					.catch(() => undefined);
			};

			timer = setTimeout(timeOut, 15000);
		}
	}
}
