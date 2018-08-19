import {
	Client,
	DMChannel,
	GroupDMChannel,
	GuildMember,
	Message,
	MessageEmbed,
	MessageEmbedOptions,
	MessageOptions,
	MessageReaction,
	TextChannel,
	User
} from 'discord.js';

const truthy = ['true', 'on', 'y', 'yes', 'enable'];

export function createEmbed(
	client: Client,
	options: MessageEmbedOptions = {}
): MessageEmbed {
	const color = options.color ? options.color : '#00AE86';
	delete options.color;
	const embed = new MessageEmbed(options);
	embed.setColor(color);
	embed.setFooter(client.user.username, client.user.avatarURL());
	embed.setTimestamp();
	return embed;
}

function convertEmbedToPlain(embed: MessageEmbed) {
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

export function sendReply(message: Message, reply: MessageEmbed | string) {
	return sendEmbed(message.channel, reply, message.author);
}

export function sendEmbed(
	target: User | TextChannel | DMChannel | GroupDMChannel,
	embed: MessageEmbed | string,
	fallbackUser?: User
) {
	const e =
		typeof embed === 'string'
			? createEmbed(target.client).setDescription(embed)
			: embed;

	return new Promise<Message | Message[]>((resolve, reject) => {
		target
			.send({ embed: e })
			.then(resolve)
			.catch(() => {
				const content = convertEmbedToPlain(e);
				target
					.send(content)
					.then(resolve)
					.catch(err => {
						if (!fallbackUser) {
							console.error(err);
							return reject(err);
						}

						fallbackUser
							.send(
								'**I do not have permissions to post to that channel.\n' +
									`Please tell an admin to allow me to send messages in the channel.**\n\n`,
								{ embed: e }
							)
							.then(resolve)
							.catch(err2 => {
								console.error(err2);
								reject(err2);
							});
					});
			});
	});
}

const upSymbol = '🔺';
const downSymbol = '🔻';
export async function showPaginated(
	client: Client,
	prevMsg: Message,
	page: number,
	maxPage: number,
	render: (page: number, maxPage: number) => MessageEmbed
) {
	// Create embed for this page
	const embed = render(page, maxPage);

	// Add page number if required
	if (page > 0 || page < maxPage - 1) {
		embed.setDescription(embed.description + `\n\nPage ${page + 1}/${maxPage}`);
	}

	if (prevMsg.editable && prevMsg.author.id === client.user.id) {
		prevMsg.edit({ embed });
	} else {
		prevMsg = (await sendEmbed(
			prevMsg.channel,
			embed,
			prevMsg.author
		)) as Message;
	}

	if (page > 0) {
		await prevMsg.react(upSymbol);
	} else {
		const react = prevMsg.reactions.get(upSymbol);
		if (react) {
			react.users.remove(client.user);
		}
	}

	if (page < maxPage - 1) {
		await prevMsg.react(downSymbol);
	} else {
		const react = prevMsg.reactions.get(downSymbol);
		if (react) {
			react.users.remove(client.user);
		}
	}

	if (page > 0 || page < maxPage - 1) {
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
	}
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
	await message.channel.send(promptStr, options);
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
