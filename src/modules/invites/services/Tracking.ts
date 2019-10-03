import { Guild, GuildAuditLog, Invite, Member, Role, TextChannel } from 'eris';
import i18n from 'i18n';
import moment from 'moment';
import { In, Not } from 'typeorm';

import { IMClient } from '../../../client';
import { JoinInvalidatedReason } from '../../../models/Join';
import { SettingsKey } from '../../../models/Setting';
import { BasicMember, GuildPermission } from '../../../types';
import { deconstruct } from '../../../util';

const GUILDS_IN_PARALLEL = 10;
const INVITE_CREATE = 40;

export class TrackingService {
	private client: IMClient;

	public pendingGuilds: Set<string> = new Set();
	public initialPendingGuilds: number = 0;

	private inviteStore: {
		[guildId: string]: { [code: string]: { uses: number; maxUses: number } };
	} = {};
	private inviteStoreUpdate: { [guildId: string]: number } = {};

	public constructor(client: IMClient) {
		this.client = client;

		client.on('ready', this.onClientReady.bind(this));
		client.on('guildRoleCreate', this.onGuildRoleCreate.bind(this));
		client.on('guildRoleDelete', this.onGuildRoleDelete.bind(this));
		client.on('guildMemberAdd', this.onGuildMemberAdd.bind(this));
		client.on('guildMemberRemove', this.onGuildMemberRemove.bind(this));
	}

	private async onClientReady() {
		if (this.client.hasStarted) {
			return;
		}

		// Save all guilds, sort descending by member count
		// (Guilds with more members are more likely to get a join)
		const allGuilds = [...this.client.guilds.values()].sort((a, b) => b.memberCount - a.memberCount);

		// Fetch all invites from DB
		const allCodes = await this.client.repo.inviteCode.find({
			where: { guildId: In(allGuilds.map(g => g.id)) }
		});

		// Initialize our cache for each guild, so we
		// don't need to do any if checks later
		allGuilds.forEach(guild => {
			this.pendingGuilds.add(guild.id);
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
					await this.insertGuildData(guild);

					console.log('EVENT(clientReady): Updated invite count for ' + guild.name);
				}

				this.pendingGuilds.delete(guild.id);
				if (this.pendingGuilds.size % 50 === 0 || this.pendingGuilds.size === 0) {
					console.log(`Pending: ${this.pendingGuilds.size}/${this.initialPendingGuilds}`);
					await this.client.rabbitmq.sendStatusToManager();
				}

				setTimeout(func, 0);
			};
			func();
		}
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

		// Create the guild first, because this event sometimes
		// gets triggered before 'guildCreate' for new guilds
		await this.client.repo.guild.save({
			id: guild.id,
			name: guild.name,
			icon: guild.iconURL,
			memberCount: guild.memberCount,
			deletedAt: null,
			banReason: null
		});

		await this.client.repo.role.save({
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

		if (!role) {
			const allRoles = await guild.getRESTRoles();
			const allRanks = await this.client.cache.ranks.get(guild.id);
			const oldRankIds = allRanks.filter(rank => !allRoles.some(r => r.id === rank.roleId)).map(r => r.id);
			await this.client.repo.rank.delete({
				guildId: guild.id,
				roleId: In(oldRankIds)
			});
			await this.client.repo.role.delete({
				guildId: guild.id,
				id: In(oldRankIds)
			});
		} else {
			await this.client.repo.rank.delete({
				roleId: role.id,
				guildId: role.guild.id
			});
			await this.client.repo.role.delete({
				id: role.id,
				guildId: role.guild.id
			});
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
			return;
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
		let possibleMatches: string = null;

		let inviteCodesUsed = this.compareInvites(oldInvs, newInvs);

		if (
			inviteCodesUsed.length === 0 &&
			guild.members.get(this.client.user.id).permission.has(GuildPermission.VIEW_AUDIT_LOGS)
		) {
			console.log(`USING AUDIT LOGS FOR ${member.id} IN ${guild.id}`);

			const logs = await guild.getAuditLogs(50, undefined, INVITE_CREATE).catch(() => null as GuildAuditLog);
			if (logs && logs.entries.length) {
				const createdCodes = logs.entries
					.filter(e => deconstruct(e.id) > lastUpdate && newInvs[e.after.code] === undefined)
					.map(e => ({
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
				inviteCodesUsed = inviteCodesUsed.concat(createdCodes.map(c => c.code));
				invs = invs.concat(createdCodes as any);
			}
		}

		let isVanity = false;
		if (inviteCodesUsed.length === 0) {
			const vanityInv = await guild.getVanity().catch(() => undefined);
			if (vanityInv && vanityInv.code) {
				isVanity = true;
				inviteCodesUsed.push(vanityInv.code as string);
				invs.push({
					code: vanityInv.code,
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
		} else {
			possibleMatches = inviteCodesUsed.join(',').substr(0, 255);
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
			.filter(inv => !!inv)
			.concat(member.user) // Add invitee
			.map(m => ({
				id: m.id,
				name: m.username,
				discriminator: m.discriminator
			}));
		const membersPromise = this.client.repo.member
			.createQueryBuilder()
			.insert()
			.values(newMembers)
			.orUpdate({ overwrite: ['name', 'discriminator'] })
			.execute();

		const channelPromise = this.client.repo.member
			.createQueryBuilder()
			.insert()
			.values(
				newAndUsedCodes
					.map(inv => inv.channel)
					.filter(c => !!c)
					.map(channel => ({
						id: channel.id,
						guildId: guild.id,
						name: channel.name
					}))
			)
			.orUpdate({ overwrite: ['name'] })
			.execute();

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
			guildId: guild.id,
			inviterId: inv.inviter ? inv.inviter.id : null,
			clearedAmount: 0,
			isVanity: !!(inv as any).vanity,
			isWidget: !inv.inviter && !(inv as any).vanity
		}));

		// Update old invite codes that were used
		if (updatedCodes.length > 0) {
			await this.client.repo.inviteCode.update(
				{
					code: In(updatedCodes)
				},
				{
					uses: () => 'uses + 1'
				}
			);
		}

		// We need the invite codes in the DB for the join
		await this.client.repo.inviteCode
			.createQueryBuilder()
			.insert()
			.values(codes)
			.orUpdate({ overwrite: ['uses'] })
			.execute();

		// Insert the join
		const join = await this.client.repo.join.save({
			exactMatchCode,
			possibleMatches,
			memberId: member.id,
			guildId: guild.id,
			createdAt: member.joinedAt,
			invalidatedReason: null,
			cleared: false
		});

		// Get settings
		const sets = await this.client.cache.settings.get(guild.id);
		const lang = sets.lang;
		const joinChannelId = sets.joinMessageChannel;

		let joinChannel = joinChannelId ? (guild.channels.get(joinChannelId) as TextChannel) : undefined;

		if (joinChannelId) {
			// Check if it's a valid channel
			if (!joinChannel) {
				console.error(`Guild ${guild.id} has invalid join message channel ${joinChannelId}`);

				// Reset the channel
				await this.client.cache.settings.setOne(guild.id, SettingsKey.joinMessageChannel, null);
			} else if (!(joinChannel instanceof TextChannel)) {
				// Someone set a non-text channel as join channel
				console.error(`Guild ${guild.id} has non-text join message channel ${joinChannelId}`);

				// Reset the channel
				await this.client.cache.settings.setOne(guild.id, SettingsKey.joinMessageChannel, null);

				joinChannel = undefined;
			} else if (!joinChannel.permissionsOf(this.client.user.id).has(GuildPermission.SEND_MESSAGES)) {
				// We don't have permission to send messages in the join channel
				console.error(`Guild ${guild.id} can't send messages in join channel ${joinChannelId}`);

				// Reset the channel
				await this.client.cache.settings.setOne(guild.id, SettingsKey.joinMessageChannel, null);

				joinChannel = undefined;
			}
		}

		// Auto remove leaves if enabled
		let removedLeaves = 0;
		if (sets.autoSubtractLeaves) {
			const { affected } = await this.client.repo.join.update(
				{
					guildId: guild.id,
					memberId: member.id,
					invalidatedReason: JoinInvalidatedReason.leave
				},
				{
					invalidatedReason: null
				}
			);
			removedLeaves = affected;
		}

		const invite = newAndUsedCodes.find(c => c.code === exactMatchCode);

		// Exit if we can't find the invite code used
		if (!invite) {
			if (joinChannel) {
				joinChannel
					.createMessage(i18n.__({ locale: lang, phrase: 'messages.joinUnknownInviter' }, { id: member.id }))
					.catch(async err => {
						// Missing permissions
						if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
							// Reset the channel
							await this.client.cache.settings.setOne(guild.id, SettingsKey.joinMessageChannel, null);
						}
					});
			}
			return;
		} else if (isVanity) {
			if (joinChannel) {
				joinChannel
					.createMessage(i18n.__({ locale: lang, phrase: 'messages.joinVanityUrl' }, { id: member.id }))
					.catch(async err => {
						// Missing permissions
						if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
							// Reset the channel
							await this.client.cache.settings.setOne(guild.id, SettingsKey.joinMessageChannel, null);
						}
					});
			}
			return;
		}

		// Auto remove fakes if enabled
		let newFakes = 0;
		if (sets.autoSubtractFakes) {
			const { affected } = await this.client.repo.join.update(
				{
					id: Not(join.id),
					guildId: guild.id,
					memberId: member.id,
					invalidatedReason: null
				},
				{
					invalidatedReason: JoinInvalidatedReason.fake
				}
			);
			newFakes = affected;
		}

		// Check if it's a server widget
		if (!invite.inviter) {
			if (joinChannel) {
				joinChannel
					.createMessage(i18n.__({ locale: lang, phrase: 'messages.joinServerWidget' }, { id: member.id }))
					.catch(async err => {
						// Missing permissions
						if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
							// Reset the channel
							await this.client.cache.settings.setOne(guild.id, SettingsKey.joinMessageChannel, null);
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
		const invCodeSettings = await this.client.cache.inviteCodes.getOne(guild.id, join.exactMatchCode);
		if (invCodeSettings && invCodeSettings.roles) {
			invCodeSettings.roles.forEach(r => member.addRole(r));
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

			await joinChannel.createMessage(typeof msg === 'string' ? msg : { embed: msg }).catch(async err => {
				// Missing permissions
				if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
					// Reset the channel
					await this.client.cache.settings.setOne(guild.id, SettingsKey.joinMessageChannel, null);
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

		const join = await this.client.repo.join.findOne({
			where: {
				guildId: guild.id,
				memberId: member.id
			},
			order: { createdAt: 'DESC' },
			relations: ['exactMatch', 'exactMatch.inviter', 'exactMatch.channel']
		});

		// We need the member in the DB for the leave
		await this.client.repo.member.save({
			id: member.id,
			name: member.user.username,
			discriminator: member.user.discriminator
		});

		const leave = await this.client.repo.leave.save({
			memberId: member.id,
			guildId: guild.id,
			joinId: join ? join.id : null
		});

		// Get settings
		const sets = await this.client.cache.settings.get(guild.id);
		const lang = sets.lang;
		const leaveChannelId = sets.leaveMessageChannel;

		// Check if leave channel is valid
		const leaveChannel = leaveChannelId ? (guild.channels.get(leaveChannelId) as TextChannel) : undefined;
		if (leaveChannelId && !leaveChannel) {
			console.error(`Guild ${guild.id} has invalid leave ` + `message channel ${leaveChannelId}`);
			// Reset the channel
			await this.client.cache.settings.setOne(guild.id, SettingsKey.leaveMessageChannel, null);
		}

		// Exit if we can't find the join
		if (!join || !join.exactMatch.code) {
			console.log(`Could not find join for ${member.id} in ` + `${guild.id} leaveId: ${leave.id}`);
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
					.catch(async err => {
						// Missing permissions
						if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
							// Reset the channel
							await this.client.cache.settings.setOne(guild.id, SettingsKey.joinMessageChannel, null);
						}
					});
			}
			return;
		}

		const inviteCode = join.exactMatch.code;
		const inviteChannelId = join.exactMatch.channelId;
		const inviteChannelName = join.exactMatch.channel.name;

		const inviterId = join.exactMatch.inviterId;
		const inviterName = join.exactMatch.inviter.name;
		const inviterDiscriminator = join.exactMatch.inviter.discriminator;

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
			const timeDiff = moment.utc(join.createdAt).diff(moment.utc(leave.createdAt), 's');

			if (timeDiff < threshold) {
				const { affected } = await this.client.repo.join.update(
					{
						id: join.id,
						invalidatedReason: null
					},
					{
						invalidatedReason: JoinInvalidatedReason.leave
					}
				);
				newLeaves = affected;
			}
		}

		const invites = await this.client.cache.invites.getOne(guild.id, inviterId);

		invites.leave -= newLeaves;
		invites.total = invites.regular + invites.custom + invites.fake + invites.leave;

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

			leaveChannel.createMessage(typeof msg === 'string' ? msg : { embed: msg }).catch(async err => {
				// Missing permissions
				if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
					// Reset the channel
					await this.client.cache.settings.setOne(guild.id, SettingsKey.joinMessageChannel, null);
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
			inv => this.inviteStore[inv.guild.id] === undefined || this.inviteStore[inv.guild.id][inv.code] === undefined
		);

		// Update our local cache
		this.inviteStore[guild.id] = this.getInviteCounts(invs);
		this.inviteStoreUpdate[guild.id] = Date.now();

		// Collect concurrent promises
		const promises: any[] = [];

		const vanityInv = await guild.getVanity().catch(() => undefined);
		if (vanityInv && vanityInv.code) {
			newInviteCodes.push({
				code: vanityInv.code,
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
			.map(i => i.inviter)
			.filter((u, i, arr) => !!u && arr.findIndex(u2 => u2 && u2.id === u.id) === i)
			.map(m => ({
				id: m.id,
				name: m.username,
				discriminator: m.discriminator,
				createdAt: moment(m.createdAt).toDate()
			}));
		if (newMembers.length > 0) {
			promises.push(
				this.client.repo.member
					.createQueryBuilder()
					.insert()
					.values(newMembers)
					.orUpdate({ overwrite: ['name', 'discriminator'] })
					.execute()
			);
		}

		// Add all new invite channels to the db
		const newChannels = newInviteCodes
			.filter(i => !!i.channel)
			.map(i => guild.channels.get(i.channel.id))
			.filter((c, i, arr) => !!c && arr.findIndex(c2 => c2.id === c.id) === i)
			.map(c => ({
				id: c.id,
				name: c.name,
				guildId: guild.id,
				createdAt: moment(c.createdAt).toDate()
			}));
		if (newChannels.length > 0) {
			promises.push(
				this.client.repo.channel
					.createQueryBuilder()
					.insert()
					.values(newChannels)
					.orUpdate({ overwrite: ['name'] })
					.execute()
			);
		}

		await Promise.all(promises);

		const codes = invs.map(inv => ({
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
		return this.client.repo.inviteCode
			.createQueryBuilder()
			.insert()
			.values(codes)
			.orUpdate({ overwrite: ['uses'] })
			.execute();
	}

	private getInviteCounts(invites: Invite[]): { [key: string]: { uses: number; maxUses: number } } {
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
