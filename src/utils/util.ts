import { Guild, Message, ResourceProxy } from '@yamdbf/core';
import {
	Client,
	DMChannel,
	GroupDMChannel,
	GuildMember,
	MessageEmbed,
	MessageEmbedOptions,
	MessageReaction,
	Role,
	TextChannel,
	User
} from 'discord.js';

import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	RankAssignmentStyle,
	RankInstance,
	ranks,
	sequelize
} from '../sequelize';

import { SettingsCache } from './SettingsCache';
import { TranslationKeys } from './Translations';

export enum CommandGroup {
	Invites = 'Invites',
	Ranks = 'Ranks',
	Admin = 'Admin',
	Other = 'Other'
}

export type RP = ResourceProxy<TranslationKeys>;

export function createEmbed(
	client: Client,
	options: MessageEmbedOptions = {}
): MessageEmbed {
	const color = options.color ? options.color : '#00AE86';
	delete options.color;
	const embed = new MessageEmbed(options);
	embed.setColor(color);
	if (client) {
		embed.setFooter('InviteManager.co', client.user.avatarURL());
	} else {
		embed.setFooter('InviteManager.co');
	}
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

export function sendEmbed(
	target: User | TextChannel | DMChannel | GroupDMChannel,
	embed: MessageEmbed,
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

	const style: RankAssignmentStyle = (await SettingsCache.get(guild.id))
		.rankAssignmentStyle;

	const allRanks = await ranks.findAll({
		where: {
			guildId: guild.id
		},
		raw: true
	});

	let highest: Role = null;
	const reached: Role[] = [];
	const notReached: Role[] = [];

	allRanks.forEach(r => {
		let role = guild.roles.get(r.roleId);
		if (role) {
			if (r.numInvites <= totalInvites) {
				reached.push(role);
				if (!highest || highest.comparePositionTo(role) < 0) {
					highest = role;
				}
			} else {
				notReached.push(role);
				// Rank requires more invites
				if (!nextRank || r.numInvites < nextRank.numInvites) {
					// Next rank is the one with lowest invites needed
					nextRank = r;
					nextRankName = role.name;
				}
			}
		} else {
			console.log('ROLE DOESNT EXIST');
		}
	});

	const myRole = guild.me.roles.highest;
	const tooHighRoles = guild.roles.filter(r => r.comparePositionTo(myRole) > 0);

	let shouldHave: Role[] = [];
	let shouldNotHave = notReached.filter(
		r => tooHighRoles.has(r.id) && member.roles.has(r.id)
	);

	// No matter what the rank assignment style is
	// we always want to remove any roles that we don't have
	await member.roles.remove(
		notReached.filter(r => !tooHighRoles.has(r.id) && member.roles.has(r.id))
	);

	if (guild.me.hasPermission('MANAGE_ROLES')) {
		if (style === RankAssignmentStyle.all) {
			// Add all roles that we've reached to the member
			const newRoles = reached.filter(r => !member.roles.has(r.id));
			// Roles that the member should have but we can't assign
			shouldHave = newRoles.filter(r => tooHighRoles.has(r.id));
			// Assign only the roles that we can assign
			await member.roles.add(newRoles.filter(r => !tooHighRoles.has(r.id)));
		} else if (style === RankAssignmentStyle.highest) {
			// Only add the highest role we've reached to the member
			// Remove roles that we've reached but aren't the highest
			const oldRoles = reached.filter(
				r => r !== highest && member.roles.has(r.id)
			);
			// Add more roles that we shouldn't have
			shouldNotHave = shouldNotHave.concat(
				oldRoles.filter(r => tooHighRoles.has(r.id))
			);
			// Remove the old ones from the member
			member.roles.remove(oldRoles.filter(r => !tooHighRoles.has(r.id)));
			// Add the highest one if we don't have it yet
			if (!member.roles.has(highest.id)) {
				if (!tooHighRoles.has(highest.id)) {
					member.roles.add(highest);
				} else {
					shouldHave = [highest];
				}
			}
		}
	} else {
		// TODO: Notify user about the fact that he deserves a promotion, but it
		// cannot be given to him because of missing permissions
	}

	return {
		numRanks: allRanks.length,
		nextRank,
		nextRankName,
		shouldHave,
		shouldNotHave
	};
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
