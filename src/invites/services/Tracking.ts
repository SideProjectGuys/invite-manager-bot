import chalk from 'chalk';
import { AnyChannel, Guild, GuildAuditLog, GuildChannel, Invite, Member, Role, TextChannel } from 'eris';
import i18n from 'i18n';
import moment from 'moment';
import os from 'os';

import { GuildSettingsKey } from '../../framework/models/GuildSetting';
import { JoinInvalidatedReason } from '../../framework/models/Join';
import { IMService } from '../../framework/services/Service';
import { BasicMember, GuildPermission } from '../../types';
import { deconstruct } from '../../util';

const GUILDS_IN_PARALLEL = os.cpus().length;
const INVITE_CREATE = 40;

export class TrackingService extends IMService {
	public pendingGuilds: Set<string> = new Set();
	public initialPendingGuilds: number = 0;

	private inviteStore: {
		[guildId: string]: { [code: string]: { uses: number; maxUses: number } };
	} = {};
	private inviteStoreUpdate: { [guildId: string]: number } = {};

	public async init() {
		this.client.on('channelCreate', this.onChannelCreate.bind(this));
		this.client.on('channelUpdate', this.onChannelUpdate.bind(this));
		this.client.on('channelDelete', this.onChannelDelete.bind(this));
		this.client.on('guildRoleCreate', this.onGuildRoleCreate.bind(this));
		this.client.on('guildRoleUpdate', this.onGuildRoleUpdate.bind(this));
		this.client.on('guildRoleDelete', this.onGuildRoleDelete.bind(this));
		this.client.on('guildMemberAdd', this.onGuildMemberAdd.bind(this));
		this.client.on('guildMemberRemove', this.onGuildMemberRemove.bind(this));
	}

	public async onClientReady() {
		if (this.client.hasStarted) {
			this.startupDone();
			return;
		}

		console.log(`Requesting ${chalk.blue(GUILDS_IN_PARALLEL)} guilds in parallel during startup`);

		// Save all guilds, sort descending by member count
		// (Guilds with more members are more likely to get a join)
		const allGuilds = [...this.client.guilds.values()].sort((a, b) => b.memberCount - a.memberCount);

		// Fetch all invites from DB
		const allCodes = await this.client.db.getAllInviteCodesForGuilds(allGuilds.map((g) => g.id));

		// Initialize our cache for each guild, so we
		// don't need to do any if checks later
		allGuilds.forEach((guild) => {
			this.pendingGuilds.add(guild.id);
			this.inviteStore[guild.id] = {};
		});

		// Update our cache to match the DB
		allCodes.forEach(
			(inv) =>
				(this.inviteStore[inv.guildId][inv.code] = {
					uses: inv.uses,
					maxUses: inv.maxUses
				})
		);

		this.initialPendingGuilds = allGuilds.length;
		for (let j = 0; j < GUILDS_IN_PARALLEL; j++) {
			const func = async () => {
				const guild = allGuilds.shift();

				if (!guild) {
					if (allGuilds.length) {
						console.error('Guild in pending list was null but list is not empty');
					}
					return;
				}

				// Filter any guilds that have the pro bot
				if (!this.client.disabledGuilds.has(guild.id)) {
					// Insert data into db
					try {
						await this.insertGuildData(guild);
					} catch (err) {
						console.error(err);
					}

					console.log(`Updated invite count for ${chalk.blue(guild.name)}`);
				}

				this.pendingGuilds.delete(guild.id);
				if (this.pendingGuilds.size % 50 === 0) {
					console.log(`Pending: ${chalk.blue(`${this.pendingGuilds.size}/${this.initialPendingGuilds}`)}`);
					await this.client.rabbitmq.sendStatusToManager();
				}

				if (this.pendingGuilds.size === 0) {
					console.log(chalk.green(`Loaded all pending guilds!`));
					this.startupDone();
				}

				setTimeout(func, 0);
			};
			// tslint:disable-next-line: no-floating-promises
			func();
		}
	}

	private async onChannelCreate(channel: AnyChannel) {
		if (!(channel instanceof GuildChannel)) {
			return;
		}

		// Ignore disabled guilds
		if (this.client.disabledGuilds.has(channel.guild.id)) {
			return;
		}

		await this.client.db.saveChannels([
			{
				id: channel.id,
				name: channel.name,
				guildId: channel.guild.id,
				createdAt: new Date(channel.createdAt)
			}
		]);
	}

	private async onChannelUpdate(channel: AnyChannel, oldChannel: AnyChannel) {
		if (!(channel instanceof GuildChannel) || !(oldChannel instanceof GuildChannel)) {
			return;
		}

		// Ignore disabled guilds
		if (this.client.disabledGuilds.has(channel.guild.id)) {
			return;
		}

		await this.client.db.saveChannels([
			{
				id: channel.id,
				name: channel.name,
				guildId: channel.guild.id,
				createdAt: new Date(channel.createdAt)
			}
		]);
	}

	private async onChannelDelete(channel: AnyChannel) {
		if (!(channel instanceof GuildChannel)) {
			return;
		}

		// Ignore disabled guilds
		if (this.client.disabledGuilds.has(channel.guild.id)) {
			return;
		}

		// Remove the channel from the filtered list if it is there
		const settings = await this.client.cache.guilds.get(channel.guild.id);
		if (settings.channels && settings.channels.some((c) => c === channel.id)) {
			await this.client.cache.guilds.setOne(
				channel.guild.id,
				GuildSettingsKey.channels,
				settings.channels.filter((c) => c !== channel.id)
			);
		}

		// TODO: Delete channel
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

		await this.client.db.saveRoles([
			{
				id: role.id,
				name: role.name,
				color: color,
				guildId: role.guild.id,
				createdAt: new Date(role.createdAt)
			}
		]);
	}

	private async onGuildRoleUpdate(guild: Guild, role: Role, oldRole: Role) {
		// Ignore disabled guilds
		if (this.client.disabledGuilds.has(guild.id)) {
			return;
		}

		let color = role.color.toString(16);
		if (color.length < 6) {
			color = '0'.repeat(6 - color.length) + color;
		}

		await this.client.db.saveRoles([
			{
				id: role.id,
				name: role.name,
				color: color,
				guildId: role.guild.id,
				createdAt: new Date(role.createdAt)
			}
		]);
	}

	private async onGuildRoleDelete(guild: Guild, role: Role) {
		// Ignore disabled guilds
		if (this.client.disabledGuilds.has(guild.id)) {
			return;
		}

		if (!role) {
			const allRoles = await guild.getRESTRoles();
			const allRanks = await this.client.cache.ranks.get(guild.id);
			const oldRoleIds = allRanks.filter((rank) => !allRoles.some((r) => r.id === rank.roleId)).map((r) => r.roleId);
			for (const roleId of oldRoleIds) {
				await this.client.db.removeRank(guild.id, roleId);
			}
		} else {
			await this.client.db.removeRank(guild.id, role.id);
		}
	}

	private async onGuildMemberAdd(guild: Guild, member: Member) {
		console.log(
			'EVENT(guildMemberAdd):',
			guild.id,
			guild.name,
			member.id,
			member.username + '#' + member.discriminator
		);

		// Ignore disabled guilds
		if (this.client.disabledGuilds.has(guild.id)) {
			return;
		}

		if (member.user.bot) {
			// Check if it's our premium bot
			if (member.user.id === this.client.config.proBotId) {
				console.log(`DISABLING BOT FOR ${guild.id} BECAUSE PRO VERSION IS ACTIVE`);
				this.client.disabledGuilds.add(guild.id);
			}

			// Exit either way
			return;
		}

		// Join roles
		const sets = await this.client.cache.guilds.get(guild.id);
		if (sets.joinRoles && sets.joinRoles.length > 0) {
			if (!guild.members.get(this.client.user.id).permission.has(GuildPermission.MANAGE_ROLES)) {
				console.log(`TRYING TO SET JOIN ROLES IN ${guild.id} WITHOUT MANAGE_ROLES PERMISSION`);
			} else {
				const premium = await this.client.cache.premium.get(guild.id);
				const roles = premium ? sets.joinRoles : sets.joinRoles.slice(0, 1);

				roles.forEach((role) => guild.addMemberRole(member.id, role, 'Join role'));
			}
		}

		// If we don't have manage server then what are we even doing here and why did you invite our bot
		if (!guild.members.get(this.client.user.id).permission.has(GuildPermission.MANAGE_GUILD)) {
			console.error(`BOT DOESN'T HAVE MANAGE SERVER PERMISSIONS FOR ${guild.id} ON MEMBERADD`);
			return;
		}

		let invs = await guild.getInvites().catch(() => [] as Invite[]);
		const lastUpdate = this.inviteStoreUpdate[guild.id];
		const newInvs = this.getInviteCounts(invs);
		const oldInvs = this.inviteStore[guild.id];

		this.inviteStore[guild.id] = newInvs;
		this.inviteStoreUpdate[guild.id] = Date.now();

		if (!oldInvs) {
			console.error('Invite cache for guild ' + guild.id + ' was undefined when adding member ' + member.id);
			return;
		}

		let exactMatchCode: string = null;
		let inviteCodesUsed = this.compareInvites(oldInvs, newInvs);

		if (
			inviteCodesUsed.length === 0 &&
			guild.members.get(this.client.user.id).permission.has(GuildPermission.VIEW_AUDIT_LOGS)
		) {
			console.log(`USING AUDIT LOGS FOR ${member.id} IN ${guild.id}`);

			const logs = await guild.getAuditLogs(50, undefined, INVITE_CREATE).catch(() => null as GuildAuditLog);
			if (logs && logs.entries.length) {
				const createdCodes = logs.entries
					.filter((e) => deconstruct(e.id) > lastUpdate && newInvs[e.after.code] === undefined)
					.map((e) => ({
						code: e.after.code,
						channel: {
							id: e.after.channel_id,
							name: (e.guild.channels.get(e.after.channel_id) || {}).name
						},
						guild: e.guild,
						inviter: e.user,
						uses: (e.after.uses as number) + 1,
						maxUses: e.after.max_uses,
						maxAge: e.after.max_age,
						temporary: e.after.temporary,
						createdAt: deconstruct(e.id)
					}));
				inviteCodesUsed = inviteCodesUsed.concat(createdCodes.map((c) => c.code));
				invs = invs.concat(createdCodes as any);
			}
		}

		let isVanity = false;
		if (inviteCodesUsed.length === 0) {
			const vanityInv = await this.client.cache.vanity.get(guild.id);
			if (vanityInv) {
				isVanity = true;
				inviteCodesUsed.push(vanityInv);
				invs.push({
					code: vanityInv,
					channel: null,
					guild,
					inviter: null,
					uses: 0,
					maxUses: 0,
					maxAge: 0,
					temporary: false,
					vanity: true
				} as any);
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
		}

		const updatedCodes: string[] = [];
		// These are all used codes, and all new codes combined.
		const newAndUsedCodes = inviteCodesUsed
			.map((code) => {
				const inv = invs.find((i) => i.code === code);
				if (inv) {
					return inv;
				}
				updatedCodes.push(code);
				return null;
			})
			.filter((inv) => !!inv)
			.concat(invs.filter((inv) => !oldInvs[inv.code]));

		// We need the members and channels in the DB for the invite codes
		const newMembers = newAndUsedCodes
			.map((inv) => inv.inviter)
			.filter((inv) => !!inv)
			.concat(member.user) // Add invitee
			.map((m) => ({
				id: m.id,
				name: m.username,
				discriminator: m.discriminator,
				guildId: guild.id
			}));
		if (newMembers.length > 0) {
			await this.client.db.saveMembers(newMembers);
		}

		const newChannels = newAndUsedCodes
			.map((inv) => inv.channel)
			.filter((c) => !!c)
			.map((channel) => ({
				id: channel.id,
				guildId: guild.id,
				name: channel.name
			}));
		if (newChannels.length > 0) {
			await this.client.db.saveChannels(newChannels);
		}

		const codes = newAndUsedCodes.map((inv) => ({
			createdAt: inv.createdAt ? new Date(inv.createdAt) : new Date(),
			code: inv.code,
			channelId: inv.channel ? inv.channel.id : null,
			isNative: !inv.inviter || inv.inviter.id !== this.client.user.id,
			maxAge: inv.maxAge,
			maxUses: inv.maxUses,
			uses: inv.uses,
			temporary: inv.temporary,
			guildId: guild.id,
			inviterId: inv.inviter ? inv.inviter.id : null,
			clearedAmount: 0,
			isVanity: !!(inv as any).vanity,
			isWidget: !inv.inviter && !(inv as any).vanity
		}));

		// Update old invite codes that were used
		if (updatedCodes.length > 0) {
			await this.client.db.incrementInviteCodesUse(guild.id, updatedCodes);
		}

		// We need the invite codes in the DB for the join
		if (codes.length > 0) {
			await this.client.db.saveInviteCodes(codes);
		}

		// Insert the join
		let joinId: number = null;
		if (exactMatchCode) {
			joinId = await this.client.db.saveJoin({
				exactMatchCode: exactMatchCode,
				memberId: member.id,
				guildId: guild.id,
				createdAt: new Date(member.joinedAt),
				invalidatedReason: null,
				cleared: false
			});
		}

		const lang = sets.lang;
		const joinChannelId = sets.joinMessageChannel;

		let joinChannel = joinChannelId ? (guild.channels.get(joinChannelId) as TextChannel) : undefined;

		if (joinChannelId) {
			// Check if it's a valid channel
			if (!joinChannel) {
				console.error(`Guild ${guild.id} has invalid join message channel ${joinChannelId}`);

				// Reset the channel
				await this.client.cache.guilds.setOne(guild.id, GuildSettingsKey.joinMessageChannel, null);
			} else if (!(joinChannel instanceof TextChannel)) {
				// Someone set a non-text channel as join channel
				console.error(`Guild ${guild.id} has non-text join message channel ${joinChannelId}`);

				// Reset the channel
				await this.client.cache.guilds.setOne(guild.id, GuildSettingsKey.joinMessageChannel, null);

				joinChannel = undefined;
			} else if (!joinChannel.permissionsOf(this.client.user.id).has(GuildPermission.SEND_MESSAGES)) {
				// We don't have permission to send messages in the join channel
				console.error(`Guild ${guild.id} can't send messages in join channel ${joinChannelId}`);

				// Reset the channel
				await this.client.cache.guilds.setOne(guild.id, GuildSettingsKey.joinMessageChannel, null);

				joinChannel = undefined;
			}
		}

		// Auto remove leaves if enabled
		let removedLeaves = 0;
		if (sets.autoSubtractLeaves) {
			const affected = await this.client.db.updateJoinInvalidatedReason(null, guild.id, {
				invalidatedReason: JoinInvalidatedReason.leave,
				memberId: member.id
			});
			removedLeaves = affected;
		}

		const invite = newAndUsedCodes.find((c) => c.code === exactMatchCode);

		// Exit if we can't find the invite code used
		if (!invite) {
			if (joinChannel) {
				joinChannel
					.createMessage(i18n.__({ locale: lang, phrase: 'messages.joinUnknownInviter' }, { id: member.id }))
					.catch(async (err) => {
						// Missing permissions
						if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
							// Reset the channel
							await this.client.cache.guilds.setOne(guild.id, GuildSettingsKey.joinMessageChannel, null);
						}
					});
			}
			return;
		} else if (isVanity) {
			if (joinChannel) {
				joinChannel
					.createMessage(i18n.__({ locale: lang, phrase: 'messages.joinVanityUrl' }, { id: member.id }))
					.catch(async (err) => {
						// Missing permissions
						if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
							// Reset the channel
							await this.client.cache.guilds.setOne(guild.id, GuildSettingsKey.joinMessageChannel, null);
						}
					});
			}
			return;
		}

		// Auto remove fakes if enabled
		let newFakes = 0;
		if (sets.autoSubtractFakes) {
			const affected = await this.client.db.updateJoinInvalidatedReason(JoinInvalidatedReason.fake, guild.id, {
				invalidatedReason: null,
				memberId: member.id,
				ignoredJoinId: joinId
			});
			newFakes = affected;
		}

		// Check if it's a server widget
		if (!invite.inviter) {
			if (joinChannel) {
				joinChannel
					.createMessage(i18n.__({ locale: lang, phrase: 'messages.joinServerWidget' }, { id: member.id }))
					.catch(async (err) => {
						// Missing permissions
						if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
							// Reset the channel
							await this.client.cache.guilds.setOne(guild.id, GuildSettingsKey.joinMessageChannel, null);
						}
					});
			}
			return;
		}

		const invitesCached = this.client.cache.invites.hasOne(guild.id, invite.inviter.id);

		const invites = await this.client.cache.invites.getOne(guild.id, invite.inviter.id);

		if (invitesCached) {
			invites.regular++;
			invites.fake -= newFakes;
			invites.leave += removedLeaves;
			invites.total = invites.regular + invites.custom + invites.fake + invites.leave;
		}

		// Add any roles for this invite code
		if (exactMatchCode) {
			const invCodeSettings = await this.client.cache.inviteCodes.getOne(guild.id, exactMatchCode);
			if (invCodeSettings && invCodeSettings.roles) {
				invCodeSettings.roles.forEach((r) => member.addRole(r));
			}
		}

		let inviter = guild.members.get(invite.inviter.id);
		if (!inviter && invite.inviter) {
			inviter = await guild.getRESTMember(invite.inviter.id).catch(() => undefined);
		}

		if (inviter) {
			// Promote the inviter if required
			let me = guild.members.get(this.client.user.id);
			if (!me) {
				me = await guild.getRESTMember(this.client.user.id).catch(() => undefined);
			}

			if (me) {
				await this.client.invs.promoteIfQualified(guild, inviter, me, invites.total);
			}
		}

		const joinMessageFormat = sets.joinMessage;
		if (joinChannel && joinMessageFormat) {
			const msg = await this.client.invs.fillJoinLeaveTemplate(joinMessageFormat, guild, member, invites, {
				invite,
				inviter: inviter || { user: invite.inviter }
			});

			await joinChannel.createMessage(typeof msg === 'string' ? msg : { embed: msg }).catch(async (err) => {
				// Missing permissions
				if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
					// Reset the channel
					await this.client.cache.guilds.setOne(guild.id, GuildSettingsKey.joinMessageChannel, null);
				}
			});
		}
	}

	private async onGuildMemberRemove(guild: Guild, member: Member) {
		console.log('EVENT(guildMemberRemove):', guild.name, member.user.username, member.user.discriminator);

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

		const join = await this.client.db.getNewestJoinForMember(guild.id, member.id);

		if (join) {
			// We need the member in the DB for the leave
			await this.client.db.saveMembers([
				{
					id: member.id,
					name: member.user.username,
					discriminator: member.user.discriminator,
					guildId: guild.id
				}
			]);

			await this.client.db.saveLeave({
				memberId: member.id,
				guildId: guild.id,
				joinId: join.id
			});
		}

		// Get settings
		const sets = await this.client.cache.guilds.get(guild.id);
		const lang = sets.lang;
		const leaveChannelId = sets.leaveMessageChannel;

		// Check if leave channel is valid
		const leaveChannel = leaveChannelId ? (guild.channels.get(leaveChannelId) as TextChannel) : undefined;
		if (leaveChannelId && !leaveChannel) {
			console.error(`Guild ${guild.id} has invalid leave message channel ${leaveChannelId}`);
			// Reset the channel
			await this.client.cache.guilds.setOne(guild.id, GuildSettingsKey.leaveMessageChannel, null);
		}

		// Exit if we can't find the join
		if (!join || !join.exactMatchCode) {
			console.log(`Could not find join for ${member.id} in ` + `${guild.id}`);
			if (leaveChannel) {
				leaveChannel
					.createMessage(
						i18n.__(
							{ locale: lang, phrase: 'messages.leaveUnknownInviter' },
							{
								tag: member.user.username + '#' + member.user.discriminator
							}
						)
					)
					.catch(async (err) => {
						// Missing permissions
						if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
							// Reset the channel
							await this.client.cache.guilds.setOne(guild.id, GuildSettingsKey.joinMessageChannel, null);
						}
					});
			}
			return;
		}

		const inviteCode = join.exactMatchCode;
		const inviteChannelId = join.channelId;
		const inviteChannelName = join.channelName;

		const inviterId = join.inviterId;
		const inviterName = join.inviterName;
		const inviterDiscriminator = join.inviterDiscriminator;

		let inviter: BasicMember = guild.members.get(inviterId);
		if (!inviter) {
			inviter = await guild.getRESTMember(inviterId).catch(() => undefined);
		}
		if (!inviter) {
			inviter = {
				user: {
					id: inviterId,
					username: inviterName,
					discriminator: inviterDiscriminator,
					avatarURL: null
				}
			};
		}

		// Auto remove leaves if enabled (and if we know the inviter)
		let newLeaves = 0;
		if (inviterId && sets.autoSubtractLeaves) {
			const threshold = Number(sets.autoSubtractLeaveThreshold);
			const timeDiff = moment().diff(moment(join.createdAt), 's');

			if (timeDiff < threshold) {
				const affected = await this.client.db.updateJoinInvalidatedReason(JoinInvalidatedReason.leave, guild.id, {
					invalidatedReason: null,
					joinId: join.id
				});
				newLeaves = affected;
			}
		}

		const invites = await this.client.cache.invites.getOne(guild.id, inviterId);

		invites.leave -= newLeaves;
		invites.total = invites.regular + invites.custom + invites.fake + invites.leave;

		if (inviter && inviter instanceof Member) {
			// Demote the inviter if required
			let me = guild.members.get(this.client.user.id);
			if (!me) {
				me = await guild.getRESTMember(this.client.user.id).catch(() => undefined);
			}

			if (me) {
				await this.client.invs.promoteIfQualified(guild, inviter, me, invites.total);
			}
		}

		const leaveMessageFormat = sets.leaveMessage;
		if (leaveChannel && leaveMessageFormat) {
			const msg = await this.client.invs.fillJoinLeaveTemplate(leaveMessageFormat, guild, member, invites, {
				invite: {
					code: inviteCode,
					channel: {
						id: inviteChannelId,
						name: inviteChannelName
					}
				},
				inviter
			});

			leaveChannel.createMessage(typeof msg === 'string' ? msg : { embed: msg }).catch(async (err) => {
				// Missing permissions
				if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
					// Reset the channel
					await this.client.cache.guilds.setOne(guild.id, GuildSettingsKey.joinMessageChannel, null);
				}
			});
		}
	}

	public async insertGuildData(guild: Guild) {
		if (!guild.members.get(this.client.user.id).permission.has(GuildPermission.MANAGE_GUILD)) {
			console.error(`BOT DOESN'T HAVE MANAGE SERVER PERMISSIONS FOR ${guild.id} ON INSERT`);
			return;
		}

		// Get the invites
		const invs = await guild.getInvites().catch(() => [] as Invite[]);

		// Filter out new invite codes
		const newInviteCodes = invs.filter(
			(inv) => this.inviteStore[inv.guild.id] === undefined || this.inviteStore[inv.guild.id][inv.code] === undefined
		);

		// Update our local cache
		this.inviteStore[guild.id] = this.getInviteCounts(invs);
		this.inviteStoreUpdate[guild.id] = Date.now();

		// Collect concurrent promises
		const promises: any[] = [];

		const vanityInv = await this.client.cache.vanity.get(guild.id);
		if (vanityInv) {
			newInviteCodes.push({
				code: vanityInv,
				channel: null,
				guild,
				inviter: null,
				uses: 0,
				maxUses: 0,
				maxAge: 0,
				temporary: false,
				vanity: true
			} as any);
		}

		// Add all new inviters to db
		const newMembers = newInviteCodes
			.map((i) => i.inviter)
			.filter((u, i, arr) => !!u && arr.findIndex((u2) => u2 && u2.id === u.id) === i)
			.map((m) => ({
				id: m.id,
				name: m.username,
				discriminator: m.discriminator,
				guildId: guild.id
			}));
		if (newMembers.length > 0) {
			promises.push(this.client.db.saveMembers(newMembers));
		}

		// Add all new invite channels to the db
		const newChannels = newInviteCodes
			.filter((i) => !!i.channel)
			.map((i) => guild.channels.get(i.channel.id))
			.filter((c, i, arr) => !!c && arr.findIndex((c2) => c2.id === c.id) === i)
			.map((c) => ({
				id: c.id,
				name: c.name,
				guildId: guild.id,
				createdAt: moment(c.createdAt).toDate()
			}));
		if (newChannels.length > 0) {
			promises.push(this.client.db.saveChannels(newChannels));
		}

		await Promise.all(promises);

		const codes = invs.map((inv) => ({
			createdAt: inv.createdAt ? moment(inv.createdAt).toDate() : new Date(),
			code: inv.code,
			channelId: inv.channel ? inv.channel.id : null,
			maxAge: inv.maxAge,
			maxUses: inv.maxUses,
			uses: inv.uses,
			temporary: inv.temporary,
			guildId: guild.id,
			inviterId: inv.inviter ? inv.inviter.id : null,
			clearedAmount: 0,
			isVanity: !!(inv as any).vanity,
			isWidget: !inv.inviter && !(inv as any).vanity
		}));

		// Then insert invite codes
		if (codes.length > 0) {
			await this.client.db.saveInviteCodes(codes);
		}
	}

	private getInviteCounts(invites: Invite[]): { [key: string]: { uses: number; maxUses: number } } {
		const localInvites: {
			[key: string]: { uses: number; maxUses: number };
		} = {};
		invites.forEach((value) => {
			localInvites[value.code] = { uses: value.uses, maxUses: value.maxUses };
		});
		return localInvites;
	}

	private compareInvites(
		oldObj: { [key: string]: { uses: number; maxUses: number } },
		newObj: { [key: string]: { uses: number; maxUses: number } }
	): string[] {
		const inviteCodesUsed: string[] = [];
		Object.keys(newObj).forEach((key) => {
			if (
				newObj[key].uses !== 0 /* ignore new empty invites */ &&
				(!oldObj[key] || oldObj[key].uses < newObj[key].uses)
			) {
				inviteCodesUsed.push(key);
			}
		});
		// Only check for max uses if we can't find any others
		if (inviteCodesUsed.length === 0) {
			Object.keys(oldObj).forEach((key) => {
				if (!newObj[key] && oldObj[key].uses === oldObj[key].maxUses - 1) {
					inviteCodesUsed.push(key);
				}
			});
		}
		return inviteCodesUsed;
	}
}
