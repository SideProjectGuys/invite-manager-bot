import {
	Guild,
	Member,
	Message,
	MessageContent,
	MessageFile,
	Role,
	TextChannel
} from 'eris';

import { IMClient } from './client';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	RankAssignmentStyle,
	RankInstance,
	ranks,
	sequelize
} from './sequelize';

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
	client: IMClient,
	guild: Guild,
	member: Member,
	me: Member,
	totalInvites: number
) {
	let nextRankName = '';
	let nextRank: RankInstance = null;

	const settings = await client.cache.get(guild.id);
	const style = settings.rankAssignmentStyle as RankAssignmentStyle;

	const allRanks = await ranks.findAll({
		where: {
			guildId: guild.id
		},
		raw: true
	});

	// Return early if we don't have any ranks so we do not
	// get any permission issues for MANAGE_ROLES
	if (allRanks.length === 0) {
		return;
	}

	let highest: Role = null;
	let dangerous: Role[] = [];
	let reached: Role[] = [];
	const notReached: Role[] = [];

	allRanks.forEach(r => {
		let role = guild.roles.get(r.roleId);
		if (role) {
			if (r.numInvites <= totalInvites) {
				reached.push(role);
				if (!highest || highest.position < role.position) {
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
			console.log('ROLE DOES NOT EXIST');
		}
	});

	let myRole: Role;
	me.roles.forEach(r => {
		const role = guild.roles.get(r);
		if (!myRole || myRole.position < role.position) {
			myRole = role;
		}
	});

	const tooHighRoles = guild.roles.filter(r => r.position > myRole.position);

	let shouldHave: Role[] = [];
	let shouldNotHave = notReached.filter(
		r => tooHighRoles.includes(r) && member.roles.includes(r.id)
	);

	// No matter what the rank assignment style is
	// we always want to remove any roles that we don't have
	notReached
		.filter(r => !tooHighRoles.includes(r) && member.roles.includes(r.id))
		.forEach(r => member.removeRole(r.id));

	if (highest && !member.roles.includes(highest.id)) {
		const rankChannelId = settings.rankAnnouncementChannel;
		if (rankChannelId) {
			const rankChannel = rankChannelId
				? (guild.channels.get(rankChannelId) as TextChannel)
				: undefined;

			// Check if it's a valid channel
			if (rankChannel) {
				const rankMessageFormat = settings.rankAnnouncementMessage;
				if (rankMessageFormat) {
					const msg = await client.msg.fillTemplate(guild, rankMessageFormat, {
						memberId: member.id,
						memberName: member.user.username,
						memberFullName:
							member.user.username + '#' + member.user.discriminator,
						memberMention: `<@${member.id}>`,
						memberImage: member.user.avatarURL,
						rankMention: `<@&${highest.id}>`,
						rankName: highest.name,
						totalInvites: totalInvites.toString()
					});
					rankChannel
						.createMessage(msg)
						.then((m: Message) => m.addReaction('🎉'));
				}
			} else {
				console.error(
					`Guild ${guild.id} has invalid ` +
					`rank announcement channel ${rankChannelId}`
				);
			}
		}
	}

	if (me.permission.has('MANAGE_ROLES')) {
		// Filter dangerous roles
		dangerous = reached.filter(
			r =>
				r.permissions.has('ADMINISTRATOR') || r.permissions.has('MANAGE_GUILD')
		);
		reached = reached.filter(r => dangerous.indexOf(r) === -1);

		if (style === RankAssignmentStyle.all) {
			// Add all roles that we've reached to the member
			let newRoles = reached.filter(r => !member.roles.includes(r.id));
			// Roles that the member should have but we can't assign
			shouldHave = newRoles.filter(r => tooHighRoles.includes(r));
			// Assign only the roles that we can assign
			newRoles
				.filter(r => !tooHighRoles.includes(r))
				.forEach(r => member.addRole(r.id));
		} else if (style === RankAssignmentStyle.highest) {
			// Only add the highest role we've reached to the member
			// Remove roles that we've reached but aren't the highest
			const oldRoles = reached.filter(
				r => r !== highest && member.roles.includes(r.id)
			);
			// Add more roles that we shouldn't have
			shouldNotHave = shouldNotHave.concat(
				oldRoles.filter(r => tooHighRoles.includes(r))
			);
			// Remove the old ones from the member
			oldRoles
				.filter(r => !tooHighRoles.includes(r))
				.forEach(r => member.removeRole(r.id));
			// Add the highest one if we don't have it yet
			if (highest && !member.roles.includes(highest.id)) {
				if (!tooHighRoles.includes(highest)) {
					member.addRole(highest.id);
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
		shouldNotHave,
		dangerous
	};
}

export class FakeChannel extends TextChannel {
	public listener: (data: any) => void;

	public createMessage(
		content: MessageContent,
		file?: MessageFile
	): Promise<Message> {
		if (this.listener) {
			this.listener(content);
		}
		return new Promise(resolve => resolve());
	}
}

export function idToBinary(num: string) {
	let bin = '';
	let high = parseInt(num.slice(0, -10), 10) || 0;
	let low = parseInt(num.slice(-10), 10);
	while (low > 0 || high > 0) {
		// tslint:disable-next-line:no-bitwise
		bin = String(low & 1) + bin;
		low = Math.floor(low / 2);
		if (high > 0) {
			low += 5000000000 * (high % 2);
			high = Math.floor(high / 2);
		}
	}
	return bin;
}

export function getShardIdForGuild(guildId: any, shardCount: number) {
	const bin = idToBinary(guildId);
	const num = parseInt(bin.substring(0, bin.length - 22), 2);
	return (num % shardCount) + 1;
}

export function to<T, U = any>(
	promise: Promise<T>,
	errorExt?: object
): Promise<[U | null, T | undefined]> {
	return promise
		.then<[null, T]>((data: T) => [null, data])
		.catch<[U, undefined]>(err => {
			if (errorExt) {
				Object.assign(err, errorExt);
			}

			return [err, undefined];
		});
}

export function getHighestRole(guild: Guild, roles: string[]): Role {
	return roles.map(role => guild.roles.get(role))
		.reduce((prev, role) => role.position > prev.position ? role : prev, { position: -1 } as Role);
}
