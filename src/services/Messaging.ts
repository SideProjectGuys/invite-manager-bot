import {
	Embed,
	EmbedBase,
	EmbedOptions,
	Emoji,
	Guild,
	Member,
	Message,
	TextableChannel,
	User
} from 'eris';
import i18n from 'i18n';
import moment from 'moment';

import { IMClient } from '../client';
import { joins } from '../sequelize';
import { PromptResult, RabbitMqMember } from '../types';
import { getInviteCounts, InviteCounts } from '../util';

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

export class Messaging {
	private client: IMClient;

	public constructor(client: IMClient) {
		this.client = client;
	}

	public createEmbed(options: EmbedOptions = {}): Embed {
		let color = options.color
			? (options.color as number | string)
			: parseInt('00AE86', 16);
		// Parse colors in hashtag/hex format
		if (typeof color === 'string') {
			const code = color.startsWith('#') ? color.substr(1) : color;
			color = parseInt(code, 16);
		}

		delete options.color;
		return {
			...options,
			type: 'rich',
			color,
			footer: {
				text: this.client.user.username,
				icon_url: this.client.user.avatarURL
			},
			fields: options.fields ? options.fields : [],
			timestamp: new Date().toISOString()
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

		return new Promise<Message | Message[]>((resolve, reject) => {
			target
				.createMessage({ embed: e })
				.then(resolve)
				.catch(error => {
					console.log(error);

					const content = convertEmbedToPlain(e);
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
								.then(channel => {
									channel
										.createMessage(
											'**I do not have permissions to post to that channel.\n' +
												`Please tell an admin to allow me to send messages in the channel.**\n\n`
										)
										.then(resolve)
										.catch(err2 => {
											console.error(err2);
											reject(err2);
										});
								})
								.catch(err2 => {
									console.log(err2);
									reject(err2);
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
				return this.createEmbed(temp);
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
		member: RabbitMqMember,
		joinedAt: number,
		inviteCode: string,
		channelId: string,
		channelName: string,
		inviterId: string,
		inviterName: string,
		inviterDiscriminator: string,
		inviter?: Member,
		invites: InviteCounts = {
			total: 0,
			regular: 0,
			custom: 0,
			fake: 0,
			leave: 0
		}
	): Promise<string | Embed> {
		// Only fetch the inviter if needed and they're undefined.
		// If the inviter is null it means we tried before and couldn't fetch them.
		if (
			typeof inviter === 'undefined' &&
			template.indexOf('{inviterName}') >= 0
		) {
			inviter = await guild.getRESTMember(inviterId).catch(() => undefined);
		}
		// Override the inviter name with the display name, if the member is still here
		inviterName = inviter && inviter.nick ? inviter.nick : inviterName;

		// Total invites is only zero if it's set by default value
		if (
			(invites.total === 0 && template.indexOf('{numInvites}') >= 0) ||
			template.indexOf('{numRegularInvites}') >= 0 ||
			template.indexOf('{numBonusInvites}') >= 0 ||
			template.indexOf('{numFakeInvites}') >= 0 ||
			template.indexOf('{numLeaveInvites}') >= 0
		) {
			invites = await getInviteCounts(guild.id, inviterId);
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

		const lang = (await this.client.cache.settings.get(guild.id)).lang;
		const unknown = i18n.__({ locale: lang, phrase: 'TEMPLATE_UNKNOWN' });

		const memberFullName =
			member.user.username + '#' + member.user.discriminator;
		const inviterFullName = inviter
			? inviter.user.username + '#' + inviter.user.discriminator
			: inviterName
				? inviterName + '#' + inviterDiscriminator
				: unknown;

		let memberName = member.nick ? member.nick : member.user.username;
		memberName = JSON.stringify(memberName).substring(1, memberName.length + 1);
		let invName = inviterName ? inviterName : unknown;
		invName = JSON.stringify(invName).substring(1, invName.length + 1);

		const _joinedAt = moment(joinedAt);
		const createdAt = moment(member.user.createdAt);

		return this.fillTemplate(
			guild,
			template,
			{
				inviteCode: inviteCode ? inviteCode : unknown,
				memberId: member.id,
				memberName: memberName,
				memberFullName: memberFullName,
				memberMention: `<@${member.id}>`,
				memberImage: member.user.avatarUrl,
				numJoins: `${numJoins}`,
				inviterId: inviterId ? inviterId : unknown,
				inviterName: invName,
				inviterFullName: inviterFullName,
				inviterMention: inviterId ? `<@${inviterId}>` : unknown,
				inviterImage: inviter ? inviter.user.avatarURL : undefined,
				numInvites: `${invites.total}`,
				numRegularInvites: `${invites.regular}`,
				numBonusInvites: `${invites.custom}`,
				numFakeInvites: `${invites.fake}`,
				numLeaveInvites: `${invites.leave}`,
				memberCount: `${guild.memberCount}`,
				channelMention: channelId ? `<#${channelId}>` : unknown,
				channelName: channelName ? channelName : unknown
			},
			{
				memberCreated: createdAt,
				firstJoin: firstJoin,
				previousJoin: prevJoin,
				joinedAt: _joinedAt
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
					this.client.setMaxListeners(this.client.getMaxListeners() - 1);
					resolve(done());
				}
			};

			this.client.setMaxListeners(this.client.getMaxListeners() + 1);
			this.client.on('messageCreate', func);

			const timeOut = () => {
				this.client.removeListener('messageCreate', func);
				this.client.setMaxListeners(this.client.getMaxListeners() - 1);
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
			prevMsg = await this.client.sendEmbed(
				prevMsg.channel,
				embed,
				prevMsg.author
			);
		}

		// Don't paginate for sudo messages
		if (sudo) {
			return;
		}

		if (page > 0) {
			await prevMsg.addReaction(upSymbol);
		} else {
			const users = await prevMsg.getReaction(upSymbol, 10);
			if (users.find(u => u.id === author.id)) {
				prevMsg.removeReaction(upSymbol, this.client.user.id);
			}
		}

		if (page < maxPage - 1) {
			await prevMsg.addReaction(downSymbol);
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
				this.client.setMaxListeners(this.client.getMaxListeners() - 1);

				const isUp = emoji.name === upSymbol;
				if (isUp && page > 0) {
					this.showPaginated(prevMsg, page - 1, maxPage, render, author);
				} else if (!isUp && page < maxPage) {
					this.showPaginated(prevMsg, page + 1, maxPage, render, author);
				}
			};

			this.client.setMaxListeners(this.client.getMaxListeners() + 1);
			this.client.on('messageReactionAdd', func);

			const timeOut = () => {
				this.client.removeListener('messageReactionAdd', func);
				this.client.setMaxListeners(this.client.getMaxListeners() - 1);
				prevMsg.removeReaction(upSymbol, this.client.user.id);
				prevMsg.removeReaction(downSymbol, this.client.user.id);
			};

			timer = setTimeout(timeOut, 15000);
		}
	}
}
