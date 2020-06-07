import { captureException, withScope } from '@sentry/node';
import { Embed, EmbedOptions, Emoji, Guild, GuildChannel, Message, TextableChannel, User } from 'eris';
import i18n from 'i18n';
import moment from 'moment';

import { GuildPermission } from '../../types';
import { GuildSettingsCache } from '../cache/GuildSettings';
import { PremiumCache } from '../cache/Premium';
import { Cache } from '../decorators/Cache';
import { Service } from '../decorators/Service';

import { DatabaseService } from './Database';
import { IMService } from './Service';

const upSymbol = '🔺';
const downSymbol = '🔻';
const truthy = new Set(['true', 'on', 'y', 'yes', 'enable']);

export enum PromptResult {
	SUCCESS,
	FAILURE,
	TIMEOUT
}

function convertEmbedToPlain(embed: EmbedOptions) {
	const url = embed.url ? `(${embed.url})` : '';
	const authorUrl = embed.author && embed.author.url ? `(${embed.author.url})` : '';

	let fields = '';
	if (embed.fields && embed.fields.length) {
		fields = '\n\n' + embed.fields.map((f) => `**${f.name}**\n${f.value}`).join('\n\n') + '\n\n';
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
export type SendReplyFunc = (message: Message, reply: EmbedOptions | string) => Promise<Message>;
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

export class MessagingService extends IMService {
	@Service() private db: DatabaseService;
	@Cache() private premiumCache: PremiumCache;
	@Cache() private guildSettingsCache: GuildSettingsCache;

	public createEmbed(options: EmbedOptions = {}, overrideFooter: boolean = true): Embed {
		let color = options.color ? (options.color as number | string) : parseInt('00AE86', 16);
		// Parse colors in hashtag/hex format
		if (typeof color === 'string') {
			const code = color.startsWith('#') ? color.substr(1) : color;
			color = parseInt(code, 16);
		}

		const footer = overrideFooter || !options.footer ? this.getDefaultFooter() : options.footer;

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
		return this.sendEmbed(message.channel, reply);
	}

	public sendEmbed(target: TextableChannel, embedOrText: EmbedOptions | string, failOnNoEmbds: boolean = true) {
		const embed = typeof embedOrText === 'string' ? this.createEmbed({ description: embedOrText }) : embedOrText;
		embed.fields = embed.fields.filter((field) => field && field.value);

		return new Promise<Message>(async (resolve, reject) => {
			if (target instanceof GuildChannel) {
				if (!target.permissionsOf(this.client.user.id).has(GuildPermission.SEND_MESSAGES)) {
					return reject(new Error(`I don't have permission to send messages in this channel.`));
				}
				if (!target.permissionsOf(this.client.user.id).has(GuildPermission.EMBED_LINKS)) {
					const msg = `I don't have permission to send embeds. Please give me the \`Embed Links\` permission for this channel.`;
					if (failOnNoEmbds) {
						return reject(new Error(msg));
					} else {
						try {
							await target.createMessage(msg);
						} catch (err) {
							// NO-OP
						}
						resolve();
					}
				}
			}

			try {
				return resolve(await target.createMessage({ embed }));
			} catch (err) {
				withScope((scope) => {
					if (target instanceof GuildChannel) {
						scope.setUser({ id: target.guild.id });
						scope.setExtra('permissions', target.permissionsOf(this.client.user.id).json);
					}
					scope.setExtra('channel', target.id);
					scope.setExtra('message', embed);
					captureException(err);
				});
				if (target instanceof GuildChannel) {
					this.db.saveIncident(target.guild, {
						id: null,
						guildId: target.guild.id,
						error: err.message,
						details: {
							channel: target.id,
							embed
						}
					});
				}
				return reject(new Error('An error occured while sending a message.'));
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
			Object.keys(strings).forEach((k) => (msg = msg.replace(new RegExp(`{${k}}`, 'g'), strings[k])));
		}

		if (dates) {
			Object.keys(dates).forEach((k) => (msg = this.fillDatePlaceholder(msg, k, dates[k])));
		}

		try {
			const temp = JSON.parse(msg);
			if (await this.premiumCache.get(guild.id)) {
				return this.createEmbed(temp, false);
			} else {
				const lang = (await this.guildSettingsCache.get(guild.id)).lang;
				msg += '\n\n' + i18n.__({ locale: lang, phrase: 'messages.joinLeaveEmbedsIsPremium' });
			}
		} catch (e) {
			//
		}

		return msg;
	}

	private fillDatePlaceholder(msg: string, name: string, value: moment.Moment | string) {
		const date = typeof value === 'string' ? value : value.calendar();
		const duration = typeof value === 'string' ? value : moment.duration(value.diff(moment())).humanize();
		const timeAgo = typeof value === 'string' ? value : value.fromNow();
		const calendar = typeof value === 'string' ? value : value.calendar();

		return msg
			.replace(new RegExp(`{${name}:date}`, 'g'), date)
			.replace(new RegExp(`{${name}:duration}`, 'g'), duration)
			.replace(new RegExp(`{${name}:timeAgo}`, 'g'), timeAgo)
			.replace(new RegExp(`{${name}:calendar}`, 'g'), calendar);
	}

	public async prompt(message: Message, promptStr: string): Promise<[PromptResult, Message]> {
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

		return new Promise<[PromptResult, Message]>((resolve) => {
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

		let doPaginate = true;
		if (prevMsg.channel instanceof GuildChannel) {
			const perm = prevMsg.channel.permissionsOf(this.client.user.id);
			if (
				!perm.has(GuildPermission.ADD_REACTIONS) ||
				!perm.has(GuildPermission.MANAGE_MESSAGES) ||
				!perm.has(GuildPermission.READ_MESSAGE_HISTORY)
			) {
				doPaginate = false;
			}
		}

		// Add page number if required
		if (page > 0 || page < maxPage - 1) {
			embed.description = embed.description + `\n\nPage ${page + 1}/${maxPage}`;
		}

		const sudo: boolean = (prevMsg as any).__sudo;

		if (prevMsg.author.id === this.client.user.id) {
			await prevMsg.edit({ embed });
			if (!author) {
				throw new Error(
					'Either the message of the original author must be passed, or you must explicitly specify the original author'
				);
			}
		} else {
			author = prevMsg.author;
			prevMsg = await this.sendEmbed(prevMsg.channel, embed);
			// If we don't have a message we probably don't have permission
			if (!prevMsg) {
				return;
			}
		}

		// Don't paginate for sudo messages
		if (sudo) {
			return;
		}

		// Don't paginate if we don't have the permissions to add and remove reactions
		if (!doPaginate) {
			return;
		}

		if (page > 0) {
			await prevMsg.addReaction(upSymbol);
		} else {
			const users = await prevMsg.getReaction(upSymbol, 10).catch(() => [] as User[]);
			if (users.find((u) => u.id === author.id)) {
				await prevMsg.removeReaction(upSymbol, this.client.user.id);
			}
		}

		if (page < maxPage - 1) {
			await prevMsg.addReaction(downSymbol);
		} else {
			const users = await prevMsg.getReaction(downSymbol, 10).catch(() => [] as User[]);
			if (users.find((u) => u.id === author.id)) {
				await prevMsg.removeReaction(downSymbol, this.client.user.id);
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
					await this.showPaginated(prevMsg, page - 1, maxPage, render, author);
				} else if (!isUp && page < maxPage) {
					await this.showPaginated(prevMsg, page + 1, maxPage, render, author);
				}
			};

			this.client.on('messageReactionAdd', func);

			const timeOut = async () => {
				this.client.removeListener('messageReactionAdd', func);
				await prevMsg.removeReaction(upSymbol, this.client.user.id);
				await prevMsg.removeReaction(downSymbol, this.client.user.id);
			};

			timer = setTimeout(timeOut, 15000);
		}
	}
}
