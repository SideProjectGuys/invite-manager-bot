import { Guild, Lang, Message } from '@yamdbf/core';
import {
	GuildMember,
	MessageAttachment,
	MessageEmbed,
	MessageOptions,
	Role,
	TextChannel
} from 'discord.js';
import moment from 'moment';

import { createCaptcha, FileMode } from './functions/Captcha';

import { IMClient } from './client';
import { createEmbed } from './functions/Messaging';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	RankAssignmentStyle,
	RankInstance,
	ranks,
	sequelize
} from './sequelize';
import { SettingsCache } from './storage/SettingsCache';

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

	const settings = await SettingsCache.get(guild.id);
	const style: RankAssignmentStyle = settings.rankAssignmentStyle;

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
			console.log('ROLE DOES NOT EXIST');
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

	if (highest && !member.roles.has(highest.id)) {
		const rankChannelId = settings.rankAnnouncementChannel;
		if (rankChannelId) {
			const rankChannel = rankChannelId
				? (guild.channels.get(rankChannelId) as TextChannel)
				: undefined;

			// Check if it's a valid channel
			if (rankChannel) {
				const rankMessageFormat = settings.rankAnnouncementMessage;
				if (rankMessageFormat) {
					const msg = await (guild.client as IMClient).fillTemplate(
						guild,
						rankMessageFormat,
						{
							memberId: member.id,
							memberName: member.user.username,
							memberFullName:
								member.user.username + '#' + member.user.discriminator,
							memberMention: `<@${member.id}>`,
							memberImage: member.user.avatarURL(),
							rankMention: `<@&${highest.id}>`,
							rankName: highest.name,
							totalInvites: totalInvites.toString()
						}
					);
					rankChannel.send(msg).then((m: Message) => m.react('tada'));
				}
			} else {
				console.error(
					`Guild ${guild.id} has invalid ` +
					`rank announcement channel ${rankChannelId}`
				);
			}
		}
	}

	if (guild.me.hasPermission('MANAGE_ROLES')) {
		// Filter dangerous roles
		dangerous = reached.filter(
			r =>
				r.permissions.has('ADMINISTRATOR') || r.permissions.has('MANAGE_GUILD')
		);
		reached = reached.filter(r => dangerous.indexOf(r) === -1);

		if (style === RankAssignmentStyle.all) {
			// Add all roles that we've reached to the member
			let newRoles = reached.filter(r => !member.roles.has(r.id));
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
			if (highest && !member.roles.has(highest.id)) {
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
		shouldNotHave,
		dangerous
	};
}

export class FakeChannel extends TextChannel {
	public listener: (data: any) => void;

	public send(
		options?: MessageOptions | MessageEmbed | MessageAttachment
	): Promise<Message | Message[]> {
		if (this.listener) {
			this.listener(options);
		}
		return new Promise(resolve => resolve());
	}
}

export enum PromptResult {
	SUCCESS,
	FAILURE,
	TIMEOUT
}

const captchaOptions = {
	size: 6,
	fileMode: FileMode.BUFFER,
	height: 100,
	noiseColor: 'rgb(10,40,100)',
	color: 'rgb(50,40,50)',
	spacing: 2,
	nofLines: 4
};

export async function sendCaptchaToUserOnJoin(
	client: IMClient,
	member: GuildMember
) {
	const settings = await SettingsCache.get(member.guild.id);

	if (settings.captchaVerificationOnJoin !== 'true') {
		return;
	}

	createCaptcha(captchaOptions, (text, buffer) => {
		const embed = createEmbed(client);
		embed.setTitle('Captcha');
		embed.setDescription(
			settings.captchaVerificationWelcomeMessage.replace(
				/\{serverName\}/g,
				member.guild.name
			)
		);
		embed.setImage('attachment://captcha.png');
		embed.attachFiles([
			{
				attachment: buffer,
				name: 'captcha.png'
			}
		]);

		const startTime = moment();

		let listenToMessage = async (target: GuildMember, message: Message) => {
			const timeLeft =
				settings.captchaVerificationTimeout * 1000 -
				moment().diff(startTime, 'millisecond');

			const confirmation = (await message.channel.awaitMessages(
				a => a.author.id === target.id,
				{ max: 1, time: timeLeft }
			)).first();

			if (!confirmation) {
				return PromptResult.TIMEOUT;
			}
			if (confirmation.content.toLowerCase() === text.toLowerCase()) {
				return PromptResult.SUCCESS;
			}
			return PromptResult.FAILURE;
		};

		member.send({ embed }).then(async (message: Message) => {
			while (true) {
				const result = await listenToMessage(member, message);

				if (result === PromptResult.SUCCESS) {
					member.send(
						settings.captchaVerificationSuccessMessage.replace(
							/\{serverName\}/g,
							member.guild.name
						)
					);
					return;
				}

				if (result === PromptResult.TIMEOUT) {
					await member.send(
						settings.captchaVerificationFailedMessage.replace(
							/\{serverName\}/g,
							member.guild.name
						)
					);
					member.kick();
					return;
				}

				member.send(Lang.res(settings.lang, 'CAPTCHA_INVALID'));
			}
		});
	});
}
