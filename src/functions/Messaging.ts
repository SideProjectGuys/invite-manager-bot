import {
	Embed,
	EmbedBase,
	EmbedOptions,
	Message,
	TextableChannel,
	User
} from 'eris';

import { IMClient } from '../client';

export function createEmbed(
	client: IMClient,
	options: EmbedOptions = {}
): Embed {
	const color = options.color ? options.color : parseInt('00AE86', 16);
	delete options.color;
	return {
		...options,
		type: 'rich',
		color,
		footer: {
			text: client.user.username,
			icon_url: client.user.avatarURL
		},
		fields: [],
		timestamp: new Date().toISOString()
	};
}

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

export function sendReply(
	client: IMClient,
	message: Message,
	reply: EmbedOptions | string
) {
	return sendEmbed(client, message.channel, reply, message.author);
}

export function sendEmbed(
	client: IMClient,
	target: TextableChannel,
	embed: EmbedOptions | string,
	fallbackUser?: User
) {
	const e =
		typeof embed === 'string'
			? createEmbed(client, { description: embed })
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

const upSymbol = '🔺';
const downSymbol = '🔻';
export async function showPaginated(
	client: IMClient,
	prevMsg: Message,
	page: number,
	maxPage: number,
	render: (page: number, maxPage: number) => Embed
) {
	// Create embed for this page
	const embed = render(page, maxPage);

	// Add page number if required
	if (page > 0 || page < maxPage - 1) {
		embed.description = embed.description + `\n\nPage ${page + 1}/${maxPage}`;
	}

	if (prevMsg.author.id === client.user.id) {
		prevMsg.edit({ embed });
	} else {
		prevMsg = (await sendEmbed(
			client,
			prevMsg.channel,
			embed,
			prevMsg.author
		)) as Message;
	}

	if (page > 0) {
		await prevMsg.addReaction(upSymbol);
	} else {
		const react = prevMsg.reactions.get(upSymbol);
		if (react) {
			react.users.remove(client.user);
		}
	}

	if (page < maxPage - 1) {
		await prevMsg.addReaction(downSymbol);
	} else {
		const react = prevMsg.reactions.get(downSymbol);
		if (react) {
			react.users.remove(client.user);
		}
	}

	/*if (page > 0 || page < maxPage - 1) {
		const filter = (reaction: MessageReaction, user: GuildMember) =>
			user.id !== client.user.id &&
			(reaction.emoji.name === upSymbol || reaction.emoji.name === downSymbol);

		prevMsg.awaitReactions(filter, { max: 1, time: 15000 }).then(collected => {
			const upReaction = collected.get(upSymbol);
			const ups = upReaction ? upReaction.count : 0;
			const downReaciton = collected.get(downSymbol);
			const downs = downReaciton ? downReaciton.count : 0;
			if (ups > downs) {
				showPaginated(client, prevMsg, page - 1, maxPage, render);
			} else if (downs > ups) {
				showPaginated(client, prevMsg, page + 1, maxPage, render);
			} else {
				const reactUp = prevMsg.reactions.get(upSymbol);
				if (reactUp) {
					reactUp.users.remove(client.user);
				}
				const reactDown = prevMsg.reactions.get(downSymbol);
				if (reactDown) {
					reactDown.users.remove(client.user);
				}
			}
		});
	}*/
}

/**
 * Represents possible results of Util#prompt
 */

export enum PromptResult {
	SUCCESS,
	FAILURE,
	TIMEOUT
}

export async function prompt(
	message: Message,
	promptStr: string,
	options?: MessageOptions
): Promise<[PromptResult, Message]> {
	await message.channel.createMessage(promptStr, options);
	const confirmation: Message = (await message.channel.awaitMessages(
		a => a.author.id === message.author.id,
		{ max: 1, time: 60000 }
	)).first();

	if (!confirmation) {
		return [PromptResult.TIMEOUT, confirmation];
	}
	if (truthy.indexOf(confirmation.content.toLowerCase()) === -1) {
		return [PromptResult.FAILURE, confirmation];
	}
	return [PromptResult.SUCCESS, confirmation];
}
