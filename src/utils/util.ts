import { Client, Collection, GuildMember, Invite, Message, MessageReaction, RichEmbed } from 'discord.js';
import { Guild, GuildStorage } from 'yamdbf';

import { customInvites, inviteCodes, LogAction, logs, RankInstance, ranks } from '../sequelize';

export const defaultJoinMessage = '{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)';
export const defaultLeaveMessage = '{memberName} **left**; Invited by **{inviterName}**';

export enum CommandGroup {
	Invites = 'Invites',
	Ranks = 'Ranks',
	Admin = 'Admin',
	Other = 'Other',
}

export function createEmbed(client: Client, embed: RichEmbed, color: string = '#00AE86'): RichEmbed {
	embed.setColor(color);
	if (client) {
		embed.setFooter('InviteManager.co', client.user.avatarURL);
	} else {
		embed.setFooter('InviteManager.co');
	}
	embed.setTimestamp();
	return embed;
}

export async function getInviteCounts(guildId: string, memberId: string):
	Promise<{ code: number, custom: number, auto: number, total: number }> {

	const codePromise = inviteCodes.sum('uses', {
		where: {
			guildId: guildId,
			inviterId: memberId,
		},
	});
	const customPromise = customInvites.sum('amount', {
		where: {
			guildId: guildId,
			memberId: memberId,
			generated: false,
		}
	});
	const autoPromise = customInvites.sum('amount', {
		where: {
			guildId: guildId,
			memberId: memberId,
			generated: true,
		}
	});
	const values = await Promise.all([codePromise, customPromise, autoPromise]);
	const code = values[0] || 0;
	const custom = values[1] || 0;
	const auto = values[2] || 0;

	return {
		code,
		custom,
		auto,
		total: code + custom + auto,
	};
}

export async function promoteIfQualified(guild: Guild, member: GuildMember, totalInvites: number) {
	let nextRankName = '';
	let nextRank: RankInstance = null;

	let rolesToAdd: string[] = [];
	const allRanks = await ranks.findAll({
		where: {
			guildId: guild.id,
		},
		raw: true,
	});

	allRanks.forEach(r => {
		let role = guild.roles.get(r.roleId);
		if (role) {
			if (r.numInvites <= totalInvites) { // Rank needs less/equal invites, so we add add role
				if (!member.roles.has(role.id)) {
					rolesToAdd.push(role.id);
				}
			} else { // Rank requires more invites
				if (nextRank) {
					if (r.numInvites < nextRank.numInvites) { // Next rank is the one with lowest invites needed
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
		nextRankName,
	};
}

export function logAction(action: LogAction, guildId: string, memberId: string, data: any) {
	return logs.create({
		id: null,
		action,
		guildId,
		memberId,
		data,
	});
}

const upSymbol = '🔺';
const downSymbol = '🔻';
export async function showPaginated(
	client: Client,
	prevMsg: Message,
	page: number,
	maxPage: number,
	render: (page: number, maxPage: number) => RichEmbed) {

	// Create embed for this page
	const embed = render(page, maxPage);
	createEmbed(client, embed);

	// Add page number if required
	if (page > 0 || page < maxPage - 1) {
		embed.setDescription(embed.description + `\n\nPage ${page + 1}/${maxPage}`);
	}

	if (prevMsg.editable && prevMsg.author.id === client.user.id) {
		prevMsg.edit({ embed });
	} else {
		prevMsg = await prevMsg.channel.send({ embed }) as Message;
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
			user.id !== client.user.id && (reaction.emoji.name === upSymbol || reaction.emoji.name === downSymbol);

		prevMsg.awaitReactions(filter, { max: 1, time: 15000 })
			.then(collected => {
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
