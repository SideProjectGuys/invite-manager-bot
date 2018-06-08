import {
	Client,
	DMChannel,
	GroupDMChannel,
	GuildMember,
	MessageReaction,
	RichEmbed,
	RichEmbedOptions,
	TextChannel,
	User
} from 'discord.js';
import { Guild, Message } from 'yamdbf';

import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	RankInstance,
	ranks,
	sequelize
} from '../sequelize';

export enum CommandGroup {
	Invites = 'Invites',
	Ranks = 'Ranks',
	Admin = 'Admin',
	Other = 'Other'
}

export function createEmbed(
	client: Client,
	options: RichEmbedOptions = {}
): RichEmbed {
	const color = options.color ? options.color : '#00AE86';
	delete options.color;
	const embed = new RichEmbed(options);
	embed.setColor(color);
	if (client) {
		embed.setFooter('InviteManager.co', client.user.avatarURL);
	} else {
		embed.setFooter('InviteManager.co');
	}
	embed.setTimestamp();
	return embed;
}

function convertEmbedToPlain(embed: RichEmbed) {
	const url = embed.url ? `(${embed.url})` : '';
	const authorUrl =
		embed.author && embed.author.url ? `(${embed.author.url})` : '';

	return (
		'**Embedded links are disabled for this channel.\n' +
		'Please tell an admin to enable them in the server settings.**\n\n' +
		(embed.author ? `_${embed.author.name}_ ${authorUrl}\n` : '') +
		(embed.title ? `**${embed.title}** ${url}\n` : '') +
		(embed.description ? embed.description + '\n' : '') +
		(embed.fields && embed.fields.length
			? '\n\n' +
			  embed.fields.map(f => `**${f.name}**\n${f.value}`).join('\n\n') +
			  '\n\n'
			: '') +
		(embed.footer ? `_${embed.footer.text}_` : '')
	);
}

export function sendEmbed(
	target: User | TextChannel | DMChannel | GroupDMChannel,
	embed: RichEmbed,
	fallbackUser?: User
) {
	return new Promise<Message | Message[]>((resolve, reject) => {
		target
			.send({ embed })
			.then(resolve)
			.catch(() => {
				const content = convertEmbedToPlain(embed);
				target
					.send(content)
					.then(resolve)
					.catch(err => {
						if (!fallbackUser) {
							return reject(err);
						}

						fallbackUser
							.send(
								'**I do not have permissions to post to that channel.\n' +
									`Please tell an admin to allow me to send messages in the channel.**\n\n`,
								{ embed }
							)
							.then(resolve)
							.catch(err2 => {
								console.log(err2);
								reject(err2);
							});
					});
			});
	});
}

export interface InviteCounts {
	regular: number;
	custom: number;
	fake: number;
	leave: number;
	total: number;
}

export async function getInviteCounts(
	guildId: string,
	memberId: string
): Promise<InviteCounts> {
	const regularPromise = inviteCodes.sum('uses', {
		where: {
			guildId: guildId,
			inviterId: memberId
		}
	});
	const customPromise = customInvites.findAll({
		attributes: [
			'generatedReason',
			[sequelize.fn('SUM', sequelize.col('amount')), 'total']
		],
		where: {
			guildId: guildId,
			memberId: memberId
		},
		group: ['generatedReason'],
		raw: true
	});
	const values = await Promise.all([regularPromise, customPromise]);

	const reg = values[0] || 0;

	const customUser = values[1].find(ci => ci.generatedReason === null) as any;
	const ctm = customUser ? parseInt(customUser.total, 10) : 0;

	const generated: { [x in CustomInvitesGeneratedReason]: number } = {
		[CustomInvitesGeneratedReason.clear_regular]: 0,
		[CustomInvitesGeneratedReason.clear_custom]: 0,
		[CustomInvitesGeneratedReason.clear_fake]: 0,
		[CustomInvitesGeneratedReason.clear_leave]: 0,
		[CustomInvitesGeneratedReason.fake]: 0,
		[CustomInvitesGeneratedReason.leave]: 0
	};

	values[1].forEach((ci: any) => {
		if (ci.generatedReason === null) {
			return;
		}
		const reason = ci.generatedReason as CustomInvitesGeneratedReason;
		const amount = parseInt(ci.total, 10);
		generated[reason] = amount;
	});

	const regular = reg + generated[CustomInvitesGeneratedReason.clear_regular];
	const custom = ctm + generated[CustomInvitesGeneratedReason.clear_custom];
	const fake =
		generated[CustomInvitesGeneratedReason.fake] +
		generated[CustomInvitesGeneratedReason.clear_fake];
	const leave =
		generated[CustomInvitesGeneratedReason.leave] +
		generated[CustomInvitesGeneratedReason.clear_leave];

	return {
		regular,
		custom,
		fake,
		leave,
		total: regular + custom + fake + leave
	};
}

export async function promoteIfQualified(
	guild: Guild,
	member: GuildMember,
	totalInvites: number
) {
	let nextRankName = '';
	let nextRank: RankInstance = null;

	let rolesToAdd: string[] = [];
	const allRanks = await ranks.findAll({
		where: {
			guildId: guild.id
		},
		raw: true
	});

	allRanks.forEach(r => {
		let role = guild.roles.get(r.roleId);
		if (role) {
			if (r.numInvites <= totalInvites) {
				// Rank needs less/equal invites, so we add add role
				if (!member.roles.has(role.id)) {
					rolesToAdd.push(role.id);
				}
			} else {
				// Rank requires more invites
				if (nextRank) {
					if (r.numInvites < nextRank.numInvites) {
						// Next rank is the one with lowest invites needed
						nextRank = r;
						nextRankName = role.name;
					}
				} else {
					nextRank = r;
					nextRankName = role.name;
				}
			}
		} else {
			console.log('ROLE DOESNT EXIST');
		}
	});

	if (rolesToAdd.length > 0) {
		if (guild.me.hasPermission('MANAGE_ROLES')) {
			member.addRoles(rolesToAdd);
		} else {
			// TODO: Notify user about the fact that he deserves a promotion, but it
			// cannot be given to him because of missing permissions
		}
	}

	return {
		numRanks: allRanks.length,
		nextRank,
		nextRankName
	};
}

const upSymbol = '🔺';
const downSymbol = '🔻';
export async function showPaginated(
	client: Client,
	prevMsg: Message,
	page: number,
	maxPage: number,
	render: (page: number, maxPage: number) => RichEmbed
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
			react.remove(client.user);
		}
	}

	if (page < maxPage - 1) {
		await prevMsg.react(downSymbol);
	} else {
		const react = prevMsg.reactions.get(downSymbol);
		if (react) {
			react.remove(client.user);
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
					reactUp.remove(client.user);
				}
				const reactDown = prevMsg.reactions.get(downSymbol);
				if (reactDown) {
					reactDown.remove(client.user);
				}
			}
		});
	}
}
