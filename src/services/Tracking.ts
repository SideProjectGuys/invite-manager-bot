import { Guild, Invite, Member, Role, TextChannel } from 'eris';
import moment from 'moment';
import { Op } from 'sequelize';

import { IMClient } from '../client';
import {
	channels,
	guilds,
	inviteCodes,
	JoinAttributes,
	JoinInvalidatedReason,
	joins,
	LeaveAttributes,
	leaves,
	members,
	ranks,
	roles,
	sequelize,
	SettingAttributes,
	settings,
	SettingsKey
} from '../sequelize';
import { defaultSettings, toDbValue } from '../settings';
import { RabbitMqMember } from '../types';
import { deconstruct } from '../util';

const GUILD_START_INTERVAL = 50;
const INVITE_CREATE = 40;

export class Tracking {
	private client: IMClient;

	public readyGuilds: number = 0;
	public totalGuilds: number = 0;

	private inviteStore: {
		[guildId: string]: { [code: string]: { uses: number; maxUses: number } };
	} = {};
	private inviteStoreUpdate: { [guildId: string]: number } = {};

	public constructor(client: IMClient) {
		this.client = client;

		client.on('ready', this.onReady.bind(this));
		client.on('guildCreate', this.onGuildCreate.bind(this));
		client.on('guildDelete', this.onGuildDelete.bind(this));
		client.on('guildRoleCreate', this.onGuildRoleCreate.bind(this));
		client.on('guildRoleDelete', this.onGuildRoleDelete.bind(this));
		client.on('guildMemberAdd', this.onGuildMemberAdd.bind(this));
		client.on('guildMemberRemove', this.onGuildMemberRemove.bind(this));
	}

	private async onReady() {
		const allGuilds = this.client.guilds;

		// Insert guilds into db
		guilds.bulkCreate(
			allGuilds.map(g => ({
				id: g.id,
				name: g.name,
				icon: g.iconURL,
				memberCount: g.memberCount,
				deletedAt: null,
				banReason: null
			})),
			{
				updateOnDuplicate: [
					'name',
					'icon',
					'memberCount',
					'updatedAt',
					'deletedAt'
				]
			}
		);

		// Fetch all invites from DB
		const allCodes = await inviteCodes.findAll({
			where: {
				guildId: allGuilds.map(g => g.id)
			},
			raw: true
		});

		// Initialize our cache for each guild, so we
		// don't need to do any if checks later
		allGuilds.forEach(guild => {
			this.inviteStore[guild.id] = {};
		});

		// Update our cache to match the DB
		allCodes.forEach(
			inv =>
				(this.inviteStore[inv.guildId][inv.code] = {
					uses: inv.uses,
					maxUses: inv.maxUses
				})
		);

		let i = 0;
		this.totalGuilds = allGuilds.size;
		allGuilds.forEach(async guild => {
			const func = async () => {
				// Filter any guilds that have the pro tracker
				if (guild.members.has(this.client.config.proBotId)) {
					console.log(
						`DISABLING TRACKER FOR ${guild.id} BECAUSE PRO VERSION IS ACTIVE`
					);
					this.client.disabledGuilds.add(guild.id);
					return;
				}

				try {
					// Insert data into db
					await this.insertGuildData(guild);

					console.log(
						'EVENT(clientReady): Updated invite count for ' + guild.name
					);
				} catch (e) {
					console.log(
						`ERROR in EVENT(clientReady):${guild.id},${guild.name}`,
						e
					);
				}

				this.readyGuilds++;
			};
			setTimeout(func, i * GUILD_START_INTERVAL);
			i++;
		});
	}

	private async onGuildCreate(guild: Guild) {
		await guilds.insertOrUpdate({
			id: guild.id,
			name: guild.name,
			icon: guild.iconURL,
			memberCount: guild.memberCount,
			deletedAt: null,
			banReason: null
		});

		try {
			// Insert data into db
			await this.insertGuildData(guild, true);

			console.log('EVENT(guildCreate):Updated invite count for ' + guild.name);
		} catch (e) {
			console.log(`ERROR in EVENT(guildCreate):${guild.id},${guild.name}`, e);
		}
	}

	private async onGuildDelete(guild: Guild) {
		// If we're disabled it means the pro tracker is in that guild,
		// so don't delete the guild
		if (this.client.disabledGuilds.has(guild.id)) {
			return;
		}

		// Remove the guild (only sets the 'deletedAt' timestamp)
		await guilds.destroy({
			where: {
				id: guild.id
			}
		});
	}

	private async onGuildRoleCreate(guild: Guild, role: Role) {
		// Ignore disabled guilds
		if (this.client.disabledGuilds.has(guild.id)) {
			return;
		}

		let color = role.color.toString(16);
		if (color.length < 6) {
			color = '0'.repeat(6 - color.length) + color;
		}
		await roles.insertOrUpdate({
			id: role.id,
			name: role.name,
			color: color,
			guildId: role.guild.id,
			createdAt: role.createdAt
		});
	}

	private async onGuildRoleDelete(guild: Guild, role: Role) {
		// Ignore disabled guilds
		if (this.client.disabledGuilds.has(guild.id)) {
			return;
		}

		await ranks.destroy({
			where: {
				roleId: role.id,
				guildId: role.guild.id
			}
		});

		await roles.destroy({
			where: {
				id: role.id,
				guildId: role.guild.id
			}
		});
	}

	private async onGuildMemberAdd(guild: Guild, member: Member) {
		console.log(
			'EVENT(guildMemberAdd):',
			guild.name,
			member.user.username,
			member.user.discriminator
		);

		// Ignore disabled guilds
		if (this.client.disabledGuilds.has(guild.id)) {
			return;
		}

		if (member.user.bot) {
			// Check if it's our premium bot
			if (member.user.id === this.client.config.proBotId) {
				console.log(
					`DISABLING TRACKER FOR ${guild.id} BECAUSE PRO VERSION IS ACTIVE`
				);
				this.client.disabledGuilds.add(guild.id);
			}
			return;
		}

		let invs = await guild.getInvites();
		const lastUpdate = this.inviteStoreUpdate[guild.id];
		const newInvs = this.getInviteCounts(invs);
		const oldInvs = this.inviteStore[guild.id];

		this.inviteStore[guild.id] = newInvs;
		this.inviteStoreUpdate[guild.id] = Date.now();

		if (!oldInvs) {
			console.error(
				'Invite cache for guild ' +
					guild.id +
					' was undefined when adding member ' +
					member.id
			);
			return;
		}

		let exactMatchCode: string = null;
		let possibleMatches: string = null;

		let inviteCodesUsed = this.compareInvites(oldInvs, newInvs);

		if (
			inviteCodesUsed.length === 0 &&
			guild.members.get(this.client.user.id).permission.has('viewAuditLogs')
		) {
			console.log(`USING AUDIT LOGS FOR ${member.id} IN ${guild.id}`);

			const logs = await guild.getAuditLogs(50, undefined, INVITE_CREATE);
			if (logs.entries.length) {
				const createdCodes = logs.entries
					.filter(
						e =>
							deconstruct(e.id) > lastUpdate &&
							newInvs[e.after.code] === undefined
					)
					.map(e => ({
						code: e.after.code,
						channel: {
							id: e.after.channel_id,
							name: e.guild.channels.get(e.after.channel_id).name
						},
						guild: e.guild,
						inviter: e.user,
						uses: e.after.uses + 1,
						maxUses: e.after.max_uses,
						maxAge: e.after.max_age,
						temporary: e.after.temporary,
						createdAt: deconstruct(e.id)
					}));
				inviteCodesUsed = inviteCodesUsed.concat(createdCodes.map(c => c.code));
				invs = invs.concat(createdCodes as any);
			}
		}

		if (inviteCodesUsed.length === 0) {
			console.error(
				`NO USED INVITE CODE FOUND: g:${guild.id} | m: ${member.id} ` +
					`| t:${member.joinedAt} | invs: ${JSON.stringify(newInvs)} ` +
					`| oldInvs: ${JSON.stringify(oldInvs)}`
			);
		}

		if (inviteCodesUsed.length === 1) {
			exactMatchCode = inviteCodesUsed[0];
		} else {
			possibleMatches = inviteCodesUsed.join(',');
		}

		const updatedCodes: string[] = [];
		// These are all used codes, and all new codes combined.
		const newAndUsedCodes = inviteCodesUsed
			.map(code => {
				const inv = invs.find(i => i.code === code);
				if (inv) {
					return inv;
				}
				updatedCodes.push(code);
				return null;
			})
			.filter(inv => !!inv)
			.concat(invs.filter(inv => !oldInvs[inv.code]));

		const newMembers = newAndUsedCodes
			.map(inv => inv.inviter)
			.filter(inviter => !!inviter)
			.concat(member.user) // Add invitee
			.map(m => ({
				id: m.id,
				name: m.username,
				discriminator: m.discriminator
			}));
		const membersPromise = members.bulkCreate(newMembers, {
			updateOnDuplicate: ['name', 'discriminator', 'updatedAt']
		});

		const channelPromise = channels.bulkCreate(
			newAndUsedCodes
				.map(inv => inv.channel)
				.map(channel => ({
					id: channel.id,
					guildId: member.guild.id,
					name: channel.name
				})),
			{
				updateOnDuplicate: ['name', 'updatedAt']
			}
		);

		// We need the members and channels in the DB for the invite codes
		await Promise.all([membersPromise, channelPromise]);

		const codes = newAndUsedCodes.map(inv => ({
			createdAt: inv.createdAt ? inv.createdAt : new Date(),
			code: inv.code,
			channelId: inv.channel ? inv.channel.id : null,
			isNative: !inv.inviter || inv.inviter.id !== this.client.user.id,
			maxAge: inv.maxAge,
			maxUses: inv.maxUses,
			uses: inv.uses,
			temporary: inv.temporary,
			guildId: member.guild.id,
			inviterId: inv.inviter ? inv.inviter.id : null,
			clearedAmount: 0
		}));

		// Update old invite codes that were used
		if (updatedCodes.length > 0) {
			await sequelize.query(
				`UPDATE \`inviteCodes\` ` +
					`SET uses = uses + 1 ` +
					`WHERE \`code\` IN (${updatedCodes.map(c => `'${c}'`).join(',')})`
			);
		}

		// We need the invite codes in the DB for the join
		await inviteCodes.bulkCreate(codes, {
			updateOnDuplicate: ['uses', 'updatedAt']
		});

		const join = await joins.create({
			id: null,
			exactMatchCode,
			possibleMatches,
			memberId: member.id,
			guildId: guild.id,
			createdAt: member.joinedAt,
			invalidatedReason: null,
			cleared: false
		});

		this._onGuildMemberAdd(
			guild,
			join,
			member,
			exactMatchCode
				? newAndUsedCodes.find(c => c.code === exactMatchCode)
				: null
		);
	}

	private async _onGuildMemberAdd(
		guild: Guild,
		join: JoinAttributes,
		member: RabbitMqMember,
		invite?: Invite
	): Promise<void> {
		console.log(member.id + ' joined ' + guild.id);

		// Get settings
		const sets = await this.client.cache.settings.get(guild.id);
		const lang = sets.lang;
		const joinChannelId = sets.joinMessageChannel;

		const joinChannel = joinChannelId
			? (guild.channels.get(joinChannelId) as TextChannel)
			: undefined;
		// Check if it's a valid channel
		if (joinChannelId && !joinChannel) {
			console.error(
				`Guild ${guild.id} has invalid ` +
					`join message channel ${joinChannelId}`
			);
			// Reset the channel
			this.client.cache.settings.setOne(
				guild.id,
				SettingsKey.joinMessageChannel,
				null
			);
		}

		// Auto remove leaves if enabled
		if (sets.autoSubtractLeaves) {
			await joins.update(
				{
					invalidatedReason: null
				},
				{
					where: {
						guildId: guild.id,
						memberId: member.id,
						invalidatedReason: JoinInvalidatedReason.leave
					}
				}
			);
		}

		// Exit if we can't find the invite code used
		if (!invite) {
			if (joinChannel) {
				joinChannel.createMessage(
					i18n.__(
						{ locale: lang, phrase: 'messages.joinUnknownInviter' },
						{ id: member.id }
					)
				);
			}
			return;
		}

		// Auto remove fakes if enabled
		if (sets.autoSubtractFakes) {
			await joins.update(
				{
					invalidatedReason: JoinInvalidatedReason.fake
				},
				{
					where: {
						id: {
							[Op.ne]: join.id
						},
						guildId: guild.id,
						memberId: member.id,
						invalidatedReason: null,
						exactMatchCode: join.exactMatchCode
					}
				}
			);
		}

		const invites = await this.client.invs.getInviteCounts(
			guild.id,
			invite.inviter.id
		);

		// Add any roles for this invite code
		let mem = guild.members.get(member.id);
		if (!mem) {
			mem = await guild.getRESTMember(member.id);
		}
		if (mem) {
			const invCodeSettings = await this.client.cache.inviteCodes.getOne(
				guild.id,
				join.exactMatchCode
			);
			if (invCodeSettings && invCodeSettings.roles) {
				invCodeSettings.roles.forEach(r => mem.addRole(r));
			}
		}

		let inviter = guild.members.get(invite.inviter.id);
		if (!inviter) {
			inviter = await guild.getRESTMember(invite.inviter.id).catch(() => null);
		}

		// Promote the inviter if required
		let me = guild.members.get(this.client.user.id);
		if (!me) {
			me = await guild.getRESTMember(this.client.user.id);
		}

		await this.client.invs.promoteIfQualified(
			guild,
			inviter,
			me,
			invites.total
		);

		const joinMessageFormat = sets.joinMessage;
		if (joinChannel && joinMessageFormat) {
			const msg = await this.client.msg.fillJoinLeaveTemplate(
				joinMessageFormat,
				guild,
				member,
				join,
				{
					invite,
					inviter,
					invites
				}
			);

			await joinChannel.createMessage(
				typeof msg === 'string' ? msg : { embed: msg }
			);
		}
	}

	private async onGuildMemberRemove(guild: Guild, member: Member) {
		console.log(
			'EVENT(guildMemberRemove):',
			guild.name,
			member.user.username,
			member.user.discriminator
		);

		if (member.user.bot) {
			// If the pro version of our bot left, re-enable this version
			if (member.user.id === this.client.config.proBotId) {
				this.client.disabledGuilds.delete(guild.id);
				console.log(`ENABLING BOT IN ${guild.id} BECAUSE PRO VERSION LEFT`);
			}

			// We don't have to record bot leave events
			return;
		}

		// Ignore disabled guilds
		if (this.client.disabledGuilds.has(guild.id)) {
			return;
		}

		const join = await joins.find({
			where: {
				guildId: guild.id,
				memberId: member.id
			},
			order: [['createdAt', 'DESC']],
			include: [
				{
					model: inviteCodes,
					as: 'exactMatch',
					include: [
						{
							model: members,
							as: 'inviter'
						},
						{
							model: channels
						}
					]
				}
			],
			raw: true
		});

		// We need the member in the DB for the leave
		await members.insertOrUpdate({
			id: member.id,
			name: member.user.username,
			discriminator: member.user.discriminator
		});

		const leave = (await leaves.bulkCreate(
			[
				{
					id: null,
					memberId: member.id,
					guildId: guild.id,
					joinId: join ? join.id : null
				}
			],
			{
				updateOnDuplicate: []
			}
		))[0];

		this._onGuildMemberRemove(
			guild,
			{
				id: member.id,
				user: {
					id: member.user.id,
					username: member.user.username,
					discriminator: member.user.discriminator,
					bot: member.user.bot,
					createdAt: member.user.createdAt,
					avatarUrl: member.user.avatarURL
				}
			},
			leave,
			join
		);
	}

	private async _onGuildMemberRemove(
		guild: Guild,
		member: RabbitMqMember,
		leave: LeaveAttributes,
		join: JoinAttributes
	) {
		if (member.user.bot) {
			return;
		}

		console.log(member.id + ' left ' + guild.id);

		// Get settings
		const sets = await this.client.cache.settings.get(guild.id);
		const lang = sets.lang;
		const leaveChannelId = sets.leaveMessageChannel;

		// Check if leave channel is valid
		const leaveChannel = leaveChannelId
			? (guild.channels.get(leaveChannelId) as TextChannel)
			: undefined;
		if (leaveChannelId && !leaveChannel) {
			console.error(
				`Guild ${guild.id} has invalid leave ` +
					`message channel ${leaveChannelId}`
			);
			// Reset the channel
			this.client.cache.settings.setOne(
				guild.id,
				SettingsKey.leaveMessageChannel,
				null
			);
		}

		// Exit if we can't find the join
		if (!join) {
			console.log(
				`Could not find join for ${member.id} in ` +
					`${guild.id} leaveId: ${leave.id}`
			);
			if (leaveChannel) {
				leaveChannel.createMessage(
					i18n.__(
						{ locale: lang, phrase: 'messages.leaveUnknownInviter' },
						{
							tag: member.user.username + '#' + member.user.discriminator
						}
					)
				);
			}
			return;
		}

		const jn = join as any;
		const inviteCode = join.exactMatchCode;
		const inviteChannelId = jn['exactMatch.channelId'];
		const inviteChannelName = jn['exactMatch.channel.name'];

		const inviterId = jn['exactMatch.inviterId'];
		const inviterName = jn['exactMatch.inviter.name'];
		const inviterDiscriminator = jn['exactMatch.inviter.discriminator'];

		// Auto remove leaves if enabled (and if we know the inviter)
		if (inviterId && sets.autoSubtractLeaves) {
			const threshold = Number(sets.autoSubtractLeaveThreshold);
			const timeDiff = moment
				.utc(join.createdAt)
				.diff(moment.utc(leave.createdAt), 's');
			if (timeDiff < threshold) {
				await joins.update(
					{
						invalidatedReason: JoinInvalidatedReason.leave
					},
					{
						where: { id: join.id }
					}
				);
			}
		}

		const leaveMessageFormat = sets.leaveMessage;
		if (leaveChannel && leaveMessageFormat) {
			const msg = await this.client.msg.fillJoinLeaveTemplate(
				leaveMessageFormat,
				guild,
				member,
				join,
				{
					invite: {
						code: inviteCode,
						channel: {
							id: inviteChannelId,
							name: inviteChannelName
						}
					},
					inviter: {
						id: inviterId,
						username: inviterName,
						discriminator: inviterDiscriminator
					}
				}
			);

			leaveChannel.createMessage(
				typeof msg === 'string' ? msg : { embed: msg }
			);
		}
	}

	private async insertGuildData(guild: Guild, isNew: boolean = false) {
		// Get the invites
		const invs = await guild.getInvites();

		// Filter out new invite codes
		const newInviteCodes = invs.filter(
			inv =>
				this.inviteStore[inv.guild.id] === undefined ||
				this.inviteStore[inv.guild.id][inv.code] === undefined
		);

		// Update our local cache
		this.inviteStore[guild.id] = this.getInviteCounts(invs);
		this.inviteStoreUpdate[guild.id] = Date.now();

		// Collect concurrent promises
		const promises: any[] = [];

		// Insert settings if this is a new guild
		if (isNew) {
			const defChannel = await this.getDefaultChannel(guild);
			const newSets = {
				...defaultSettings,
				[SettingsKey.joinMessageChannel]: defChannel ? defChannel.id : null
			};

			const sets: SettingAttributes[] = Object.keys(newSets)
				.filter((key: SettingsKey) => newSets[key] !== null)
				.map((key: SettingsKey) => ({
					id: null,
					key,
					value: toDbValue(key, newSets[key]),
					guildId: guild.id
				}));

			promises.push(
				settings.bulkCreate(sets, {
					ignoreDuplicates: true
				})
			);
		}

		// Add all new inviters to db
		promises.push(
			members.bulkCreate(
				newInviteCodes
					.map(i => i.inviter)
					.filter(
						(u, i, arr) => u && arr.findIndex(u2 => u2 && u2.id === u.id) === i
					)
					.map(m => ({
						id: m.id,
						name: m.username,
						discriminator: m.discriminator,
						createdAt: m.createdAt
					})),
				{
					updateOnDuplicate: ['name', 'discriminator', 'updatedAt']
				}
			)
		);

		// Add all new invite channels to the db
		promises.push(
			channels.bulkCreate(
				newInviteCodes
					.map(i => guild.channels.get(i.channel.id))
					.filter((c, i, arr) => c && arr.findIndex(c2 => c2.id === c.id) === i)
					.map(c => ({
						id: c.id,
						name: c.name,
						guildId: guild.id,
						createdAt: c.createdAt
					})),
				{
					updateOnDuplicate: ['name', 'updatedAt']
				}
			)
		);

		await Promise.all(promises);

		const codes = invs.map(inv => ({
			createdAt: inv.createdAt ? inv.createdAt : new Date(),
			code: inv.code,
			channelId: inv.channel ? inv.channel.id : null,
			maxAge: inv.maxAge,
			maxUses: inv.maxUses,
			uses: inv.uses,
			temporary: inv.temporary,
			guildId: guild.id,
			inviterId: inv.inviter ? inv.inviter.id : null,
			clearedAmount: 0
		}));

		// Then insert invite codes
		return inviteCodes.bulkCreate(codes, {
			updateOnDuplicate: ['uses', 'updatedAt']
		});
	}

	private async getDefaultChannel(guild: Guild) {
		// get "original" default channel
		if (guild.channels.has(guild.id)) {
			return guild.channels.get(guild.id);
		}

		// Check for a "general" channel, which is often default chat
		const gen = guild.channels.find(c => c.name === 'general');
		if (gen) {
			return gen;
		}

		// First channel in order where the bot can speak
		return guild.channels
			.filter(
				c =>
					c.type ===
					ChannelType.GUILD_TEXT /*&&
					c.permissionsOf(guild.self).has('SEND_MESSAGES')*/
			)
			.sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))[0];
	}

	private getInviteCounts(
		invites: Invite[]
	): { [key: string]: { uses: number; maxUses: number } } {
		const localInvites: {
			[key: string]: { uses: number; maxUses: number };
		} = {};
		invites.forEach(value => {
			localInvites[value.code] = { uses: value.uses, maxUses: value.maxUses };
		});
		return localInvites;
	}

	private compareInvites(
		oldObj: { [key: string]: { uses: number; maxUses: number } },
		newObj: { [key: string]: { uses: number; maxUses: number } }
	): string[] {
		const inviteCodesUsed: string[] = [];
		Object.keys(newObj).forEach(key => {
			if (
				newObj[key].uses !== 0 /* ignore new empty invites */ &&
				(!oldObj[key] || oldObj[key].uses < newObj[key].uses)
			) {
				inviteCodesUsed.push(key);
			}
		});
		// Only check for max uses if we can't find any others
		if (inviteCodesUsed.length === 0) {
			Object.keys(oldObj).forEach(key => {
				if (!newObj[key] && oldObj[key].uses === oldObj[key].maxUses - 1) {
					inviteCodesUsed.push(key);
				}
			});
		}
		return inviteCodesUsed;
	}
}
