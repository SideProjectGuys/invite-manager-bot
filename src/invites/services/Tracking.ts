import chalk from 'chalk';
import { AnyChannel, Guild, GuildAuditLog, GuildChannel, Invite, Member, Role, TextChannel } from 'eris';
import i18n from 'i18n';
import moment from 'moment';
import os from 'os';

import { GuildSettingsCache } from '../../framework/cache/GuildSettings';
import { InviteCodeSettingsCache } from '../../framework/cache/InviteCodeSettings';
import { PremiumCache } from '../../framework/cache/Premium';
import { Cache } from '../../framework/decorators/Cache';
import { Service } from '../../framework/decorators/Service';
import { Lang } from '../../framework/models/GuildSettings';
import { InviteCode } from '../../framework/models/InviteCode';
import { DatabaseService } from '../../framework/services/Database';
import { RabbitMqService } from '../../framework/services/RabbitMq';
import { IMService } from '../../framework/services/Service';
import { BasicMember, GuildFeature, GuildPermission, VanityInvite } from '../../types';
import { deconstruct } from '../../util';
import { InvitesCache } from '../cache/InvitesCache';
import { RanksCache } from '../cache/RanksCache';
import { VanityCache } from '../cache/VanityCache';
import { InvitesGuildSettings } from '../models/GuildSettings';
import { InvitesInviteCodeSettings } from '../models/InviteCodeSettings';
import { JoinInvalidatedReason } from '../models/Join';

import { InvitesService } from './Invites';
import { RanksService } from './Ranks';

const GUILDS_IN_PARALLEL = os.cpus().length;
const INVITE_CREATE = 40;

interface InviteStore {
	uses: number;
	maxUses: number;
	inviterId: string | null;
	channelId: string | null;
}

interface GuildInviteStore {
	lastUpdate: number;
	invites: Map<string, InviteStore>;
}

type NewInviteCode = InviteCode & { type: 'n' };
type UpdatedInviteCode = {
	type: 'u';
	code: string;
	uses: number;
	inviterId: string | null;
	channelId: string | null;
	isVanity: boolean;
};

export class TrackingService extends IMService {
	@Service() private db: DatabaseService;
	@Service() private ranks: RanksService;
	@Service() private invs: InvitesService;
	@Service(() => RabbitMqService) private rabbitmq: RabbitMqService;
	@Cache() private guildSettingsCache: GuildSettingsCache;
	@Cache() private premiumCache: PremiumCache;
	@Cache() private ranksCache: RanksCache;
	@Cache() private invitesCache: InvitesCache;
	@Cache() private vanityCache: VanityCache;
	@Cache() private inviteCodeSettingsCache: InviteCodeSettingsCache;

	public pendingGuilds: Set<string> = new Set();
	public initialPendingGuilds: number = 0;

	private inviteStore: Map<string, GuildInviteStore> = new Map();

	public async onClientReady() {
		this.client.on('inviteCreate', this.onInviteCreate.bind(this));
		this.client.on('inviteDelete', this.onDeleteInvite.bind(this));
		this.client.on('channelCreate', this.onChannelCreate.bind(this));
		this.client.on('channelUpdate', this.onChannelUpdate.bind(this));
		this.client.on('channelDelete', this.onChannelDelete.bind(this));
		this.client.on('guildCreate', this.onGuildCreate.bind(this));
		this.client.on('guildRoleCreate', this.onGuildRoleCreate.bind(this));
		this.client.on('guildRoleUpdate', this.onGuildRoleUpdate.bind(this));
		this.client.on('guildRoleDelete', this.onGuildRoleDelete.bind(this));
		this.client.on('guildMemberAdd', this.onGuildMemberAdd.bind(this));
		this.client.on('guildMemberRemove', this.onGuildMemberRemove.bind(this));

		console.log(`Requesting ${chalk.blue(GUILDS_IN_PARALLEL)} guilds in parallel during startup`);

		// Save all guilds, sort descending by member count
		// (Guilds with more members are more likely to get a join)
		const allGuilds = [...this.client.guilds.values()].sort((a, b) => b.memberCount - a.memberCount);

		// Fetch all invites from DB
		const allCodes = await this.db.getAllInviteCodesForGuilds(allGuilds.map((g) => g.id));

		// Initialize our cache for each guild, so we don't need to do any if checks later
		allGuilds.forEach((guild) => {
			this.pendingGuilds.add(guild.id);
			this.inviteStore.set(guild.id, { lastUpdate: 0, invites: new Map() });
		});

		// Update our cache to match the DB
		allCodes.forEach((inv) =>
			this.inviteStore.get(inv.guildId).invites.set(inv.code, {
				uses: inv.uses,
				maxUses: inv.maxUses,
				inviterId: inv.inviterId,
				channelId: inv.channelId
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
					await this.rabbitmq.sendStatusToManager();
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

	private async onInviteCreate(guild: Guild, invite: Invite) {
		await this.db.saveInviteCodes([
			{
				createdAt: invite.createdAt ? new Date(invite.createdAt) : new Date(),
				code: invite.code,
				channelId: invite.channel ? invite.channel.id : null,
				maxAge: invite.maxAge,
				maxUses: invite.maxUses,
				uses: invite.uses,
				temporary: invite.temporary,
				guildId: guild.id,
				inviterId: invite.inviter ? invite.inviter.id : null,
				clearedAmount: 0,
				isVanity: false,
				isWidget: false
			}
		]);
	}

	private async onDeleteInvite(guild: Guild, invite: Invite) {
		await this.db.saveInviteCodes([
			{
				createdAt: invite.createdAt ? new Date(invite.createdAt) : new Date(),
				code: invite.code,
				channelId: invite.channel ? invite.channel.id : null,
				maxAge: invite.maxAge,
				maxUses: invite.maxUses,
				uses: invite.uses,
				temporary: invite.temporary,
				guildId: guild.id,
				inviterId: invite.inviter ? invite.inviter.id : null,
				clearedAmount: 0,
				isVanity: false,
				isWidget: false
			}
		]);
	}

	private async onChannelCreate(channel: AnyChannel) {
		if (!(channel instanceof GuildChannel)) {
			return;
		}

		// Ignore disabled guilds
		if (this.client.disabledGuilds.has(channel.guild.id)) {
			return;
		}

		await this.db.saveChannels([
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

		await this.db.saveChannels([
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
		const settings = await this.guildSettingsCache.get(channel.guild.id);
		if (settings.channels && settings.channels.some((c) => c === channel.id)) {
			await this.guildSettingsCache.setOne(
				channel.guild.id,
				'channels',
				settings.channels.filter((c) => c !== channel.id)
			);
		}
	}

	private async onGuildCreate(guild: Guild) {
		// Insert tracking data
		await this.insertGuildData(guild);
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

		await this.db.saveRoles([
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

		await this.db.saveRoles([
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
			const allRanks = await this.ranksCache.get(guild.id);
			const oldRoleIds = allRanks.filter((rank) => !allRoles.some((r) => r.id === rank.roleId)).map((r) => r.roleId);
			for (const roleId of oldRoleIds) {
				await this.ranks.removeRank(guild.id, roleId);
			}
		} else {
			await this.ranks.removeRank(guild.id, role.id);
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
		const sets = await this.guildSettingsCache.get<InvitesGuildSettings>(guild.id);
		if (sets.joinRoles && sets.joinRoles.length > 0) {
			if (!guild.members.get(this.client.user.id).permission.has(GuildPermission.MANAGE_ROLES)) {
				console.log(`TRYING TO SET JOIN ROLES IN ${guild.id} WITHOUT MANAGE_ROLES PERMISSION`);
			} else {
				const premium = await this.premiumCache.get(guild.id);
				const roles = premium ? sets.joinRoles : sets.joinRoles.slice(0, 1);

				roles.forEach((role) => guild.addMemberRole(member.id, role, 'Join role'));
			}
		}

		// If we don't have manage server then what are we even doing here and why did you invite our bot
		if (!guild.members.get(this.client.user.id).permission.has(GuildPermission.MANAGE_GUILD)) {
			console.error(`BOT DOESN'T HAVE MANAGE SERVER PERMISSIONS FOR ${guild.id} ON MEMBERADD`);
			return;
		}

		const usedInviteCodes: (NewInviteCode | UpdatedInviteCode)[] = [];
		const invStore = this.inviteStore.get(guild.id);

		if (!invStore) {
			console.error('Invite store for guild ' + guild.id + ' was undefined when adding member ' + member.id);
			return;
		}

		// Check vanity first if applicable
		if (guild.features.includes(GuildFeature.VANITY_URL)) {
			const newInv = (await guild.getVanity().catch(() => null)) as VanityInvite;
			const oldInv = invStore.invites.get(newInv.code);

			if (newInv && newInv.uses > (oldInv ? oldInv.uses : 0)) {
				invStore.invites.set(newInv.code, { uses: newInv.uses, maxUses: 0, inviterId: null, channelId: null });

				if (oldInv) {
					usedInviteCodes.push({
						type: 'u',
						code: newInv.code,
						uses: newInv.uses,
						inviterId: null,
						channelId: null,
						isVanity: true
					});
				} else {
					usedInviteCodes.push({
						type: 'n',
						createdAt: new Date(),
						code: newInv.code,
						guildId: guild.id,
						channelId: null,
						inviterId: null,
						maxAge: 0,
						maxUses: 0,
						uses: newInv.uses,
						temporary: false,
						clearedAmount: 0,
						isVanity: true,
						isWidget: false
					});
				}
			}
		}

		if (usedInviteCodes.length === 0) {
			const newInvs = await guild.getInvites().catch(() => [] as Invite[]);

			for (const newInv of newInvs) {
				const oldInv = invStore.invites.get(newInv.code);
				if (!oldInv || oldInv.uses < newInv.uses) {
					// We always update any invite codes that changed
					invStore.invites.set(newInv.code, {
						uses: newInv.uses,
						maxUses: newInv.maxUses,
						inviterId: newInv.inviter ? newInv.inviter.id : null,
						channelId: newInv.channel ? newInv.channel.id : null
					});

					if (oldInv) {
						usedInviteCodes.push({
							type: 'u',
							code: newInv.code,
							uses: newInv.uses,
							inviterId: newInv.inviter ? newInv.inviter.id : null,
							channelId: newInv.channel ? newInv.channel.id : null,
							isVanity: false
						});
					} else {
						usedInviteCodes.push({
							type: 'n',
							createdAt: newInv.createdAt ? new Date(newInv.createdAt) : new Date(),
							code: newInv.code,
							guildId: guild.id,
							inviterId: newInv.inviter ? newInv.inviter.id : null,
							channelId: newInv.channel ? newInv.channel.id : null,
							maxAge: newInv.maxAge,
							maxUses: newInv.maxUses,
							uses: newInv.uses,
							temporary: newInv.temporary,
							clearedAmount: 0,
							isVanity: false,
							isWidget: false
						});
					}
				}
			}

			// Save the fact that we updated all our codes (for the audit logs check)
			invStore.lastUpdate = Date.now();

			// If we can't find any code then look for an invite that wasn't returned in the new list
			// and was one use before maxUses in the old list and assume that it is now gone
			if (usedInviteCodes.length === 0) {
				for (const [oldInvCode, oldInvStore] of invStore.invites.entries()) {
					if (oldInvStore.uses === oldInvStore.maxUses - 1 && !newInvs.some((newInv) => newInv.code === oldInvCode)) {
						invStore.invites.delete(oldInvCode);
						usedInviteCodes.push({
							type: 'u',
							code: oldInvCode,
							uses: oldInvStore.maxUses,
							inviterId: oldInvStore.inviterId,
							channelId: oldInvStore.channelId,
							isVanity: false
						});
					}
				}
			}
		}

		if (
			usedInviteCodes.length === 0 &&
			guild.members.get(this.client.user.id).permission.has(GuildPermission.VIEW_AUDIT_LOGS)
		) {
			const logs = (await guild.getAuditLogs(50, undefined, INVITE_CREATE).catch(() => null)) as GuildAuditLog;
			if (logs && logs.entries.length) {
				const createdCode = logs.entries.find(
					(e) => deconstruct(e.id) > invStore.lastUpdate && invStore.invites.get(e.after.code) === undefined
				);

				if (createdCode) {
					invStore.invites.set(createdCode.after.code, {
						uses: createdCode.after.uses,
						maxUses: createdCode.after.max_uses,
						inviterId: createdCode.user.id,
						channelId: createdCode.after.channel_id
					});
					usedInviteCodes.push({
						type: 'n',
						createdAt: new Date(deconstruct(createdCode.id)),
						code: createdCode.after.code,
						guildId: createdCode.guild.id,
						channelId: createdCode.after.channel_id,
						inviterId: createdCode.user.id,
						maxAge: createdCode.after.max_age,
						maxUses: createdCode.after.max_uses,
						uses: (createdCode.after.uses as number) + 1,
						temporary: createdCode.after.temporary,
						clearedAmount: 0,
						isVanity: false,
						isWidget: false
					});
				}
			}
		}

		if (usedInviteCodes.length === 0) {
			console.error(`NO USED INVITE CODE FOUND: g: ${guild.id} | m: ${member.id} | t: ${member.joinedAt}`);
		}

		let exactMatchCode: string = null;
		if (usedInviteCodes.length === 1) {
			exactMatchCode = usedInviteCodes[0].code;
		}

		const newCodes = usedInviteCodes.filter((c) => c.type === 'n') as NewInviteCode[];
		const updatedCodes = usedInviteCodes.filter((c) => c.type === 'u') as UpdatedInviteCode[];

		// Insert any new members
		const newMembers = newCodes
			.map((inv) => this.client.users.get(inv.inviterId))
			.filter((user) => !!user)
			.concat(member.user) // Add invitee
			.map((m) => ({
				id: m.id,
				name: m.username,
				discriminator: m.discriminator,
				guildId: guild.id
			}));
		if (newMembers.length > 0) {
			await this.db.saveMembers(newMembers);
		}

		const newChannels = newCodes
			.map((inv) => guild.channels.get(inv.channelId))
			.filter((channel) => !!channel)
			.map((channel) => ({
				id: channel.id,
				guildId: guild.id,
				name: channel.name
			}));
		if (newChannels.length > 0) {
			await this.db.saveChannels(newChannels);
		}

		// Update old invite codes that were used
		if (updatedCodes.length > 0) {
			await this.db.incrementInviteCodesUse(
				guild.id,
				updatedCodes.map((c) => c.code)
			);
		}

		// Insert new invite codes that we don't have yet
		if (newCodes.length > 0) {
			await this.db.saveInviteCodes(newCodes);
		}

		// Insert the join
		let joinId: number = null;
		if (exactMatchCode) {
			joinId = await this.invs.saveJoin({
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
				await this.guildSettingsCache.setOne<InvitesGuildSettings>(guild.id, 'joinMessageChannel', null);
			} else if (!(joinChannel instanceof TextChannel)) {
				// Someone set a non-text channel as join channel
				console.error(`Guild ${guild.id} has non-text join message channel ${joinChannelId}`);

				// Reset the channel
				await this.guildSettingsCache.setOne<InvitesGuildSettings>(guild.id, 'joinMessageChannel', null);

				joinChannel = undefined;
			} else if (!joinChannel.permissionsOf(this.client.user.id).has(GuildPermission.SEND_MESSAGES)) {
				// We don't have permission to send messages in the join channel
				console.error(`Guild ${guild.id} can't send messages in join channel ${joinChannelId}`);

				// Reset the channel
				await this.guildSettingsCache.setOne<InvitesGuildSettings>(guild.id, 'joinMessageChannel', null);

				joinChannel = undefined;
			}
		}

		// Auto remove leaves if enabled
		let removedLeaves = 0;
		if (sets.autoSubtractLeaves) {
			const affected = await this.invs.updateJoinInvalidatedReason(null, guild.id, {
				invalidatedReason: JoinInvalidatedReason.leave,
				memberId: member.id
			});
			removedLeaves = affected;
		}

		const invite = usedInviteCodes.find((c) => c.code === exactMatchCode);

		// Exit if we can't find the invite code used
		if (invite && invite.isVanity) {
			if (joinChannel) {
				joinChannel
					.createMessage(i18n.__({ locale: lang, phrase: 'messages.joinVanityUrl' }, { id: member.id }))
					.catch(async (err) => {
						// Missing permissions
						if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
							// Reset the channel
							await this.guildSettingsCache.setOne<InvitesGuildSettings>(guild.id, 'joinMessageChannel', null);
						}
					});
			}
			return;
		} else if (!invite || !invite.inviterId) {
			if (joinChannel) {
				joinChannel
					.createMessage(i18n.__({ locale: lang, phrase: 'messages.joinUnknownInviter' }, { id: member.id }))
					.catch(async (err) => {
						// Missing permissions
						if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
							// Reset the channel
							await this.guildSettingsCache.setOne<InvitesGuildSettings>(guild.id, 'joinMessageChannel', null);
						}
					});
			}
			return;
		}

		// Auto remove fakes if enabled
		let newFakes = 0;
		if (sets.autoSubtractFakes) {
			const affected = await this.invs.updateJoinInvalidatedReason(JoinInvalidatedReason.fake, guild.id, {
				invalidatedReason: null,
				memberId: member.id,
				ignoredJoinId: joinId
			});
			newFakes = affected;
		}

		const invitesCached = this.invitesCache.hasOne(guild.id, invite.inviterId);
		const invites = await this.invitesCache.getOne(guild.id, invite.inviterId);

		if (invitesCached) {
			invites.regular++;
			invites.fake -= newFakes;
			invites.leave += removedLeaves;
			invites.total = invites.regular + invites.custom + invites.fake + invites.leave;
		}

		// Add any roles for this invite code
		const invCodeSettings = await this.inviteCodeSettingsCache.getOne<InvitesInviteCodeSettings>(guild.id, invite.code);
		if (invCodeSettings && invCodeSettings.roles) {
			invCodeSettings.roles.forEach((r) => member.addRole(r));
		}

		let inviter = guild.members.get(invite.inviterId);
		if (!inviter && invite.inviterId) {
			inviter = await guild.getRESTMember(invite.inviterId).catch(() => undefined);
		}

		if (inviter) {
			// Promote the inviter if required
			let me = guild.members.get(this.client.user.id);
			if (!me) {
				me = await guild.getRESTMember(this.client.user.id).catch(() => undefined);
			}

			if (me) {
				await this.invs.promoteIfQualified(guild, inviter, me, invites.total);
			}
		}

		const joinMessageFormat = sets.joinMessage;
		if (joinChannel && joinMessageFormat) {
			const inviteMember =
				inviter ||
				(await this.db.getMember(guild.id, invite.inviterId).then((m) => ({
					nick: null,
					user: {
						id: m.id,
						createdAt: m.createdAt.getTime(),
						username: m.name,
						discriminator: m.discriminator,
						avatarURL: null
					}
				})));

			const channel = guild.channels.get(invite.channelId);
			const msg = await this.invs.fillJoinLeaveTemplate(joinMessageFormat, {
				guild,
				member,
				invites,
				invite: { code: invite.code, channel },
				inviter: inviteMember
			});

			await joinChannel.createMessage(typeof msg === 'string' ? msg : { embed: msg }).catch(async (err) => {
				// Missing permissions
				if (err.code === 50001 || err.code === 50020 || err.code === 50013) {
					// Reset the channel
					await this.guildSettingsCache.setOne<InvitesGuildSettings>(guild.id, 'joinMessageChannel', null);
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

		const join = await this.invs.getNewestJoinForMember(guild.id, member.id);

		if (join) {
			// We need the member in the DB for the leave
			await this.db.saveMembers([
				{
					id: member.id,
					name: member.user.username,
					discriminator: member.user.discriminator,
					guildId: guild.id
				}
			]);

			await this.invs.saveLeave({
				memberId: member.id,
				guildId: guild.id,
				joinId: join.id
			});
		}

		// Get settings
		const sets = await this.guildSettingsCache.get<InvitesGuildSettings>(guild.id);
		const lang = sets.lang;
		const leaveChannelId = sets.leaveMessageChannel;

		// Check if leave channel is valid
		const leaveChannel = leaveChannelId ? (guild.channels.get(leaveChannelId) as TextChannel) : undefined;
		if (leaveChannelId && !leaveChannel) {
			console.error(`Guild ${guild.id} has invalid leave message channel ${leaveChannelId}`);
			// Reset the channel
			await this.guildSettingsCache.setOne<InvitesGuildSettings>(guild.id, 'leaveMessageChannel', null);
		}

		// Exit if we can't find the join
		if (!join || !join.exactMatchCode) {
			console.log(`Could not find join for ${member.id} in ` + `${guild.id}`);
			await this.sendleaveUnknownInviter(lang, leaveChannel, guild, member);
			return;
		}

		const inviteCode = join.exactMatchCode;
		const inviteChannelId = join.channelId;
		const inviteChannelName = join.channelName;

		const inviterId = join.inviterId;
		const inviterName = join.inviterName;
		const inviterDiscriminator = join.inviterDiscriminator;

		let inviter: BasicMember = guild.members.get(inviterId);
		if (inviterId) {
			if (!inviter) {
				inviter = await guild.getRESTMember(inviterId).catch(() => undefined);
			}
			if (!inviter) {
				inviter = {
					nick: null,
					user: {
						id: inviterId,
						createdAt: deconstruct(inviterId),
						username: inviterName,
						discriminator: inviterDiscriminator,
						avatarURL: null
					}
				};
			}
		} else {
			// Exit if we don't have inviterId
			console.log(`Could not find inviterId for join ${join.id} in ` + `${guild.id}`);
			await this.sendleaveUnknownInviter(lang, leaveChannel, guild, member);
			return;
		}

		// Auto remove leaves if enabled (and if we know the inviter)
		let newLeaves = 0;
		if (inviterId && sets.autoSubtractLeaves) {
			const threshold = Number(sets.autoSubtractLeaveThreshold);
			const timeDiff = moment().diff(moment(join.createdAt), 's');

			if (timeDiff < threshold) {
				const affected = await this.invs.updateJoinInvalidatedReason(JoinInvalidatedReason.leave, guild.id, {
					invalidatedReason: null,
					joinId: join.id
				});
				newLeaves = affected;
			}
		}

		const invites = await this.invitesCache.getOne(guild.id, inviterId);

		invites.leave -= newLeaves;
		invites.total = invites.regular + invites.custom + invites.fake + invites.leave;

		if (inviter && inviter instanceof Member) {
			// Demote the inviter if required
			let me = guild.members.get(this.client.user.id);
			if (!me) {
				me = await guild.getRESTMember(this.client.user.id).catch(() => undefined);
			}

			if (me) {
				await this.invs.promoteIfQualified(guild, inviter, me, invites.total);
			}
		}

		const leaveMessageFormat = sets.leaveMessage;
		if (leaveChannel && leaveMessageFormat) {
			const msg = await this.invs.fillJoinLeaveTemplate(leaveMessageFormat, {
				guild,
				member,
				invites,
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
					await this.guildSettingsCache.setOne<InvitesGuildSettings>(guild.id, 'joinMessageChannel', null);
				}
			});
		}
	}

	private async sendleaveUnknownInviter(lang: Lang, leaveChannel: TextChannel, guild: Guild, member: Member) {
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
						await this.guildSettingsCache.setOne<InvitesGuildSettings>(guild.id, 'leaveMessageChannel', null);
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

		let invStore = this.inviteStore.get(guild.id);

		// Filter out new invite codes. If we don't have an invite store yet this guild is probably new
		const newInviteCodes = invs.filter((inv) => !invStore || !this.inviteStore.get(guild.id).invites.get(inv.code));

		// Update our local cache
		if (!invStore) {
			invStore = { lastUpdate: Date.now(), invites: new Map() };
			this.inviteStore.set(guild.id, invStore);
		}

		for (const newInv of invs) {
			invStore.invites.set(newInv.code, {
				uses: newInv.uses,
				maxUses: newInv.maxUses,
				inviterId: newInv.inviter ? newInv.inviter.id : null,
				channelId: newInv.channel ? newInv.channel.id : null
			});
		}

		// Collect concurrent promises
		const promises: any[] = [];

		// Check the vanity invite if we have one
		if (guild.features.includes(GuildFeature.VANITY_URL)) {
			const vanityInv = (await guild.getVanity().catch(() => null)) as VanityInvite;
			if (vanityInv) {
				newInviteCodes.push({
					code: vanityInv.code,
					channel: null,
					guild,
					inviter: null,
					uses: vanityInv.uses,
					maxUses: 0,
					maxAge: 0,
					temporary: false,
					vanity: true
				} as any);
			}
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
			promises.push(this.db.saveMembers(newMembers));
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
			promises.push(this.db.saveChannels(newChannels));
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
			await this.db.saveInviteCodes(codes);
		}
	}

	public getStatus() {
		return {
			pendingGuilds: this.pendingGuilds.size,
			initialPendingGuilds: this.initialPendingGuilds
		};
	}

	public async getDiagnose(guild: Guild) {
		const sets = await this.guildSettingsCache.get<InvitesGuildSettings>(guild.id);

		let joinChannelPerms: { [key: string]: boolean } = {};
		if (sets.joinMessageChannel) {
			const joinChannel = guild.channels.get(sets.joinMessageChannel);
			if (joinChannel) {
				joinChannelPerms = joinChannel.permissionsOf(this.client.user.id).json;
			} else {
				joinChannelPerms = { 'Invalid channel': true };
			}
		} else {
			joinChannelPerms = { 'Not set': true };
		}

		let leaveChannelPerms: { [key: string]: boolean } = {};
		if (sets.leaveMessageChannel) {
			const leaveChannel = guild.channels.get(sets.leaveMessageChannel);
			if (leaveChannel) {
				leaveChannelPerms = leaveChannel.permissionsOf(this.client.user.id).json;
			} else {
				leaveChannelPerms = { 'Invalid channel': true };
			}
		} else {
			leaveChannelPerms = { 'Not set': true };
		}

		let annChannelPerms: { [key: string]: boolean } = {};
		if (sets.rankAnnouncementChannel) {
			const annChannel = guild.channels.get(sets.rankAnnouncementChannel);
			if (annChannel) {
				annChannelPerms = annChannel.permissionsOf(this.client.user.id).json;
			} else {
				annChannelPerms = { 'Invalid channel': true };
			}
		} else {
			annChannelPerms = { 'Not set': true };
		}

		return {
			joinChannelPerms,
			leaveChannelPerms,
			announceChannelPerms: annChannelPerms
		};
	}
}
