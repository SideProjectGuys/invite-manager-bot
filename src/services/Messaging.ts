import { captureException, withScope } from '@sentry/node';
import {
	Embed,
	EmbedBase,
	EmbedOptions,
	Emoji,
	Guild,
	Member,
	Message,
	TextableChannel,
	TextChannel,
	User
} from 'eris';
import i18n from 'i18n';
import moment from 'moment';

import { IMClient } from '../client';
import { joins } from '../sequelize';
import { PromptResult } from '../types';

import { InviteCounts } from './Invites';

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

export interface BasicInvite {
	code: string;
	channel: {
		id: string;
		name: string;
	};
}
export interface BasicMember {
	nick?: string;
	user: {
		id: string;
		username: string;
		discriminator: string;
		avatarURL: string;
	};
}
export interface JoinLeaveTemplateData {
	invite: BasicInvite;
	inviter: BasicMember;
	invites?: InviteCounts;
}

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

		e.fields = e.fields.filter(field => field.value);

		return new Promise<Message>((resolve, reject) => {
			target
				.createMessage({ embed: e })
				.then(resolve)
				.catch(error => {
					console.error(error);

					const content = convertEmbedToPlain(e);

					if (error.code !== 50013) {
						withScope(scope => {
							if (target instanceof TextChannel) {
								scope.setUser({ id: target.guild.id });
							}
							scope.setExtra('message', e);
							captureException(error);
						});
					}

					target
						.createMessage(content)
						.then(resolve)
						.catch(err => {
							if (!fallbackUser) {
								console.error(err);
								return reject(err);
							}

							fallbackUser
								.getDMChannel()
								.then(dmChannel => {
									let msg =
										'I encountered an error when trying to send a message. ' +
										'Please report this to a developer:\n```' +
										`${error.message}\n\n${err.message}\`\`\``;

									if (err.code === 50013) {
										const name = this.client.user.username;
										msg =
											`**${name} does not have permissions to post to that channel.\n` +
											`Please allow ${name} to send messages in that channel.**\n\n`;
									}

									dmChannel
										.createMessage(msg)
										.then(resolve)
										.catch(err2 => {
											console.error(err2);
											return reject(err2);
										});
								})
								.catch(err2 => {
									console.log(err2);
									return reject(err2);
								});
						});
				});
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

	public async fillJoinLeaveTemplate(
		template: any,
		guild: Guild,
		member: Member,
		{ invite, inviter, invites }: JoinLeaveTemplateData
	): Promise<string | Embed> {
		if (!invites) {
			if (
				template.indexOf('{numInvites}') >= 0 ||
				template.indexOf('{numRegularInvites}') >= 0 ||
				template.indexOf('{numBonusInvites}') >= 0 ||
				template.indexOf('{numFakeInvites}') >= 0 ||
				template.indexOf('{numLeaveInvites}') >= 0
			) {
				invites = await this.client.invs.getInviteCounts(
					guild.id,
					inviter.user.id
				);
			} else {
				invites = {
					custom: 0,
					fake: 0,
					leave: 0,
					regular: 0,
					total: 0
				};
			}
		}

		let numJoins = 0;
		if (template.indexOf('{numJoins}') >= 0) {
			numJoins = await joins.count({
				where: {
					guildId: guild.id,
					memberId: member.id
				}
			});
		}

		let firstJoin: moment.Moment | string = 'never';
		if (template.indexOf('{firstJoin:') >= 0) {
			const temp = await joins.find({
				where: {
					guildId: guild.id,
					memberId: member.id
				},
				order: [['createdAt', 'ASC']]
			});
			if (temp) {
				firstJoin = moment(temp.createdAt);
			}
		}

		let prevJoin: moment.Moment | string = 'never';
		if (template.indexOf('{previousJoin:') >= 0) {
			const temp = await joins.find({
				where: {
					guildId: guild.id,
					memberId: member.id
				},
				order: [['createdAt', 'DESC']],
				offset: 1
			});
			if (temp) {
				prevJoin = moment(temp.createdAt);
			}
		}

		const memberFullName =
			member.user.username + '#' + member.user.discriminator;
		const inviterFullName =
			inviter.user.username + '#' + inviter.user.discriminator;

		let memberName = member.nick ? member.nick : member.user.username;
		memberName = JSON.stringify(memberName).substring(1, memberName.length + 1);

		let invName = inviter.nick ? inviter.nick : inviter.user.username;
		invName = JSON.stringify(invName).substring(1, invName.length + 1);

		const joinedAt = moment(member.joinedAt);
		const createdAt = moment(member.user.createdAt);

		return this.fillTemplate(
			guild,
			template,
			{
				inviteCode: invite.code,
				memberId: member.id,
				memberName: memberName,
				memberFullName: memberFullName,
				memberMention: `<@${member.id}>`,
				memberImage: member.user.avatarURL,
				numJoins: `${numJoins}`,
				inviterId: inviter.user.id,
				inviterName: invName,
				inviterFullName: inviterFullName,
				inviterMention: `<@${inviter.user.id}>`,
				inviterImage: inviter.user.avatarURL,
				numInvites: `${invites.total}`,
				numRegularInvites: `${invites.regular}`,
				numBonusInvites: `${invites.custom}`,
				numFakeInvites: `${invites.fake}`,
				numLeaveInvites: `${invites.leave}`,
				memberCount: `${guild.memberCount}`,
				channelMention: `<#${invite.channel.id}>`,
				channelName: invite.channel.name
			},
			{
				memberCreated: createdAt,
				firstJoin: firstJoin,
				previousJoin: prevJoin,
				joinedAt: joinedAt
			}
		);
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
		}

		// Don't paginate for sudo messages
		if (sudo) {
			return;
		}

		if (page > 0) {
			await prevMsg.addReaction(upSymbol).catch(() => undefined);
		} else {
			const users = await prevMsg.getReaction(upSymbol, 10);
			if (users.find(u => u.id === author.id)) {
				prevMsg.removeReaction(upSymbol, this.client.user.id);
			}
		}

		if (page < maxPage - 1) {
			await prevMsg.addReaction(downSymbol).catch(() => undefined);
		} else {
			const users = await prevMsg.getReaction(downSymbol, 10);
			if (users.find(u => u.id === author.id)) {
				prevMsg.removeReaction(downSymbol, this.client.user.id);
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
				prevMsg.removeReaction(upSymbol, this.client.user.id);
				prevMsg.removeReaction(downSymbol, this.client.user.id);
			};

			timer = setTimeout(timeOut, 15000);
		}
	}
}
