import Sequelize from 'sequelize';

const config = require('../config.json');

export const sequelize = new Sequelize(config.sequelize);

export interface BaseAttributes {
	createdAt?: Date | number | string;
	updatedAt?: Date | number | string;
	deletedAt?: Date | number | string;
}

// ------------------------------------
// Members
// ------------------------------------
export interface MemberAttributes extends BaseAttributes {
	id: string;
	name: string;
	discriminator: string;
}
export interface MemberInstance
	extends Sequelize.Instance<MemberAttributes>,
		MemberAttributes {
	getInviteCodes: Sequelize.HasManyGetAssociationsMixin<InviteCodeInstance>;
	getJoins: Sequelize.HasManyGetAssociationsMixin<JoinInstance>;
	getLeaves: Sequelize.HasManyGetAssociationsMixin<LeaveInstance>;
	getMemberSettings: Sequelize.HasManyGetAssociationsMixin<
		MemberSettingsInstance
	>;
	getCustomInvites: Sequelize.HasManyGetAssociationsMixin<CustomInviteInstance>;
	// TODO: get custom invites via creatorId
	getCommandUsage: Sequelize.HasManyGetAssociationsMixin<CommandUsageInstance>;
	getPresences: Sequelize.HasManyGetAssociationsMixin<PresenceInstance>;
	getLogs: Sequelize.HasManyGetAssociationsMixin<LogInstance>;
	getPremiumSubscriptions: Sequelize.HasManyGetAssociationsMixin<
		PremiumSubscriptionInstance
	>;
}

export const members = sequelize.define<MemberInstance, MemberAttributes>(
	'member',
	{
		id: { type: Sequelize.STRING(32), primaryKey: true },
		name: Sequelize.STRING,
		discriminator: Sequelize.STRING
	},
	{
		timestamps: true,
		paranoid: true
	}
);

// ------------------------------------
// Guilds
// ------------------------------------
export interface GuildAttributes extends BaseAttributes {
	id: string;
	name: string;
	icon: string;
	memberCount: number;
}
export interface GuildInstance
	extends Sequelize.Instance<GuildAttributes>,
		GuildAttributes {
	getRoles: Sequelize.HasManyGetAssociationsMixin<RoleInstance>;
	getChannels: Sequelize.HasManyGetAssociationsMixin<ChannelInstance>;
	getSettings: Sequelize.HasManyGetAssociationsMixin<SettingInstance>;
	getMemberSettings: Sequelize.HasManyGetAssociationsMixin<
		MemberSettingsInstance
	>;
	getInviteCodes: Sequelize.HasManyGetAssociationsMixin<InviteCodeInstance>;
	getJoins: Sequelize.HasManyGetAssociationsMixin<JoinInstance>;
	getLeaves: Sequelize.HasManyGetAssociationsMixin<LeaveInstance>;
	getCustomInvites: Sequelize.HasManyGetAssociationsMixin<CustomInviteInstance>;
	getRanks: Sequelize.HasManyGetAssociationsMixin<RankInstance>;
	getCommandUsage: Sequelize.HasManyGetAssociationsMixin<CommandUsageInstance>;
	getPresences: Sequelize.HasManyGetAssociationsMixin<PresenceInstance>;
	getLogs: Sequelize.HasManyGetAssociationsMixin<LogInstance>;
	getPremiumSubscriptions: Sequelize.HasManyGetAssociationsMixin<
		PremiumSubscriptionInstance
	>;
}

export const guilds = sequelize.define<GuildInstance, GuildAttributes>(
	'guild',
	{
		id: { type: Sequelize.STRING(32), primaryKey: true },
		name: Sequelize.STRING,
		icon: Sequelize.STRING,
		memberCount: Sequelize.INTEGER
	},
	{
		timestamps: true,
		paranoid: true
	}
);

// ------------------------------------
// Roles
// ------------------------------------
export interface RoleAttributes extends BaseAttributes {
	id: string;
	name: string;
	color: string;
	guildId: string;
}
export interface RoleInstance
	extends Sequelize.Instance<RoleAttributes>,
		RoleAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getRanks: Sequelize.HasManyGetAssociationsMixin<RankInstance>;
}

export const roles = sequelize.define<RoleInstance, RoleAttributes>(
	'role',
	{
		id: { type: Sequelize.STRING(32), primaryKey: true },
		name: Sequelize.STRING,
		color: Sequelize.STRING({ length: 7 })
	},
	{
		timestamps: true,
		paranoid: true
	}
);

roles.belongsTo(guilds);
guilds.hasMany(roles);

// ------------------------------------
// Channels
// ------------------------------------
export interface ChannelAttributes extends BaseAttributes {
	id: string;
	name: string;
	guildId: string;
}
export interface ChannelInstance
	extends Sequelize.Instance<ChannelAttributes>,
		ChannelAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getInviteCodes: Sequelize.HasManyGetAssociationsMixin<InviteCodeInstance>;
}

export const channels = sequelize.define<ChannelInstance, ChannelAttributes>(
	'channel',
	{
		id: { type: Sequelize.STRING(32), primaryKey: true },
		name: Sequelize.STRING
	},
	{
		timestamps: true,
		paranoid: true
	}
);

channels.belongsTo(guilds);
guilds.hasMany(channels);

// ------------------------------------
// Settings
// ------------------------------------
export enum SettingsKey {
	prefix = 'prefix',
	joinMessage = 'joinMessage',
	joinMessageChannel = 'joinMessageChannel',
	leaveMessage = 'leaveMessage',
	leaveMessageChannel = 'leaveMessageChannel',
	lang = 'lang',
	modRole = 'modRole',
	modChannel = 'modChannel',
	logChannel = 'logChannel',
	getUpdates = 'getUpdates',
	leaderboardStyle = 'leaderboardStyle',
	autoSubtractFakes = 'autoSubtractFakes',
	autoSubtractLeaves = 'autoSubtractLeaves',
	autoSubtractLeaveThreshold = 'autoSubtractLeaveThreshold',
	rankAssignmentStyle = 'rankAssignmentStyle',
	rankAnnouncementChannel = 'rankAnnouncementChannel',
	rankAnnouncementMessage = 'rankAnnouncementMessage',
	hideLeftMembersFromLeaderboard = 'hideLeftMembersFromLeaderboard',
	captchaVerificationOnJoin = 'captchaVerificationOnJoin',
	captchaVerificationWelcomeMessage = 'captchaVerificationWelcomeMessage',
	captchaVerificationSuccessMessage = 'captchaVerificationSuccessMessage',
	captchaVerificationFailedMessage = 'captchaVerificationFailedMessage',
	captchaVerificationTimeout = 'captchaVerificationTimeout'
}

export enum Lang {
	de = 'de',
	en = 'en',
	es = 'es',
	fr = 'fr',
	it = 'it',
	nl = 'nl',
	pt = 'pt',
	ro = 'ro',
	sv = 'sv'
}

export enum LeaderboardStyle {
	normal = 'normal',
	table = 'table',
	mentions = 'mentions'
}

export enum RankAssignmentStyle {
	all = 'all',
	highest = 'highest'
}

export function getSettingsType(key: SettingsKey) {
	if (
		key === SettingsKey.joinMessageChannel ||
		key === SettingsKey.leaveMessageChannel ||
		key === SettingsKey.modChannel ||
		key === SettingsKey.logChannel ||
		key === SettingsKey.rankAnnouncementChannel
	) {
		return 'Channel';
	}
	if (
		key === SettingsKey.getUpdates ||
		key === SettingsKey.autoSubtractFakes ||
		key === SettingsKey.autoSubtractLeaves ||
		key === SettingsKey.hideLeftMembersFromLeaderboard
	) {
		return 'Boolean';
	}
	if (key === SettingsKey.autoSubtractLeaveThreshold) {
		return 'Number';
	}
	return 'String';
}

export const defaultSettings: { [k in SettingsKey]: string } = {
	prefix: '!',
	lang: Lang.en,
	joinMessage:
		'{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)',
	joinMessageChannel: null,
	leaveMessage: '{memberName} **left**; Invited by **{inviterName}**',
	leaveMessageChannel: null,
	modRole: null,
	modChannel: null,
	logChannel: null,
	getUpdates: 'true',
	leaderboardStyle: LeaderboardStyle.normal,
	autoSubtractFakes: 'true',
	autoSubtractLeaves: 'true',
	autoSubtractLeaveThreshold: '600' /* seconds */,
	rankAssignmentStyle: RankAssignmentStyle.all,
	rankAnnouncementChannel: null,
	rankAnnouncementMessage:
		'Congratulations, **{memberMention}** has reached the **{rankName}** rank!',
	hideLeftMembersFromLeaderboard: 'false',
	captchaVerificationOnJoin: 'false',
	captchaVerificationWelcomeMessage: 'Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.',
	captchaVerificationSuccessMessage: 'You have successfully entered the captcha. Welcome to the server!',
	captchaVerificationFailedMessage: 'You did not enter the captha right within the specified time. We\'re sorry, but we have to kick you from the server. Feel free to join again.',
	captchaVerificationTimeout: '180' /* seconds */
};

export interface SettingAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	key: SettingsKey;
	value: string;
}
export interface SettingInstance
	extends Sequelize.Instance<SettingAttributes>,
		SettingAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
}

export const settings = sequelize.define<SettingInstance, SettingAttributes>(
	'setting',
	{
		key: Sequelize.ENUM(
			SettingsKey.prefix,
			SettingsKey.joinMessage,
			SettingsKey.joinMessageChannel,
			SettingsKey.leaveMessage,
			SettingsKey.leaveMessageChannel,
			SettingsKey.lang,
			SettingsKey.modRole,
			SettingsKey.modChannel,
			SettingsKey.logChannel,
			SettingsKey.getUpdates,
			SettingsKey.leaderboardStyle,
			SettingsKey.autoSubtractFakes,
			SettingsKey.autoSubtractLeaves,
			SettingsKey.autoSubtractLeaveThreshold,
			SettingsKey.rankAssignmentStyle,
			SettingsKey.rankAnnouncementChannel,
			SettingsKey.rankAnnouncementMessage,
			SettingsKey.hideLeftMembersFromLeaderboard,
			SettingsKey.captchaVerificationOnJoin,
			SettingsKey.captchaVerificationWelcomeMessage,
			SettingsKey.captchaVerificationSuccessMessage,
			SettingsKey.captchaVerificationFailedMessage,
			SettingsKey.captchaVerificationTimeout
		),
		value: Sequelize.TEXT
	},
	{
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				unique: true,
				fields: ['guildId', 'key']
			}
		]
	}
);
settings.belongsTo(guilds);
guilds.hasMany(settings);

// ------------------------------------
// MemberSettings
// ------------------------------------
export enum MemberSettingsKey {
	hideFromLeaderboard = 'hideFromLeaderboard'
}

export function getMemberSettingsType(key: MemberSettingsKey) {
	if (key === MemberSettingsKey.hideFromLeaderboard) {
		return 'Boolean';
	}
	return 'String';
}

export const defaultMemberSettings: { [k in MemberSettingsKey]: string } = {
	hideFromLeaderboard: 'false'
};

export interface MemberSettingsAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	memberId: string;
	key: MemberSettingsKey;
	value: string;
}
export interface MemberSettingsInstance
	extends Sequelize.Instance<MemberSettingsAttributes>,
		MemberSettingsAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const memberSettings = sequelize.define<
	MemberSettingsInstance,
	MemberSettingsAttributes
>(
	'memberSettings',
	{
		key: Sequelize.ENUM(MemberSettingsKey.hideFromLeaderboard),
		value: Sequelize.TEXT
	},
	{
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				unique: true,
				fields: ['guildId', 'memberId', 'key']
			}
		]
	}
);

memberSettings.belongsTo(guilds);
guilds.hasMany(memberSettings);

memberSettings.belongsTo(members);
members.hasMany(memberSettings);

// ------------------------------------
// Invite Codes
// ------------------------------------
export interface InviteCodeAttributes extends BaseAttributes {
	code: string;
	channelId: string;
	maxAge: number;
	maxUses: number;
	uses: number;
	temporary: boolean;
	deletedAt?: Date;
	guildId: string;
	inviterId: string;
}
export interface InviteCodeInstance
	extends Sequelize.Instance<InviteCodeAttributes>,
		InviteCodeAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getInviter: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
	getJoins: Sequelize.HasManyGetAssociationsMixin<JoinInstance>;
	getSettings: Sequelize.HasManyGetAssociationsMixin<
		InviteCodeSettingsInstance
	>;
}

export const inviteCodes = sequelize.define<
	InviteCodeInstance,
	InviteCodeAttributes
>(
	'inviteCode',
	{
		code: {
			type: Sequelize.STRING(16) + ' CHARSET utf8mb4 COLLATE utf8mb4_bin',
			primaryKey: true
		},
		maxAge: Sequelize.INTEGER,
		maxUses: Sequelize.INTEGER,
		uses: Sequelize.INTEGER,
		temporary: Sequelize.BOOLEAN
	},
	{
		timestamps: true,
		paranoid: true
	}
);

inviteCodes.belongsTo(guilds);
guilds.hasMany(inviteCodes);

inviteCodes.belongsTo(channels);
channels.hasMany(inviteCodes);

inviteCodes.belongsTo(members, { as: 'inviter', foreignKey: 'inviterId' });
members.hasMany(inviteCodes, { foreignKey: 'inviterId' });

// ------------------------------------
// Invite Code Settings
// ------------------------------------
export enum InviteCodeSettingsKey {
	name = 'name',
	roles = 'roles'
}

export function getInviteCodeSettingsType(key: InviteCodeSettingsKey) {
	return 'String';
}

export const defaultInviteCodeSettings: {
	[k in InviteCodeSettingsKey]: string
} = {
	name: null,
	roles: null
};

export interface InviteCodeSettingsAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	inviteCode: string;
	key: InviteCodeSettingsKey;
	value: string;
}
export interface InviteCodeSettingsInstance
	extends Sequelize.Instance<InviteCodeSettingsAttributes>,
		InviteCodeSettingsAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getInviteCode: Sequelize.BelongsToGetAssociationMixin<InviteCodeInstance>;
}

export const inviteCodeSettings = sequelize.define<
	InviteCodeSettingsInstance,
	InviteCodeSettingsAttributes
>(
	'inviteCodeSettings',
	{
		key: Sequelize.ENUM(
			InviteCodeSettingsKey.name,
			InviteCodeSettingsKey.roles
		),
		value: Sequelize.TEXT
	},
	{
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				unique: true,
				fields: ['guildId', 'inviteCode']
			}
		]
	}
);

inviteCodeSettings.belongsTo(guilds);
guilds.hasMany(inviteCodeSettings);

inviteCodeSettings.belongsTo(inviteCodes, {
	as: 'invite',
	foreignKey: 'inviteCode'
});
inviteCodes.hasMany(inviteCodeSettings, { foreignKey: 'inviteCode' });

// ------------------------------------
// Joins
// ------------------------------------
export interface JoinAttributes extends BaseAttributes {
	id: number;
	exactMatchCode: string;
	possibleMatches: string;
	guildId: string;
	memberId: string;
	leaveId: number;
}
export interface JoinInstance
	extends Sequelize.Instance<JoinAttributes>,
		JoinAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
	getExactMatch: Sequelize.BelongsToGetAssociationMixin<InviteCodeInstance>;
	getLeave: Sequelize.HasOneGetAssociationMixin<LeaveInstance>;
}

export const joins = sequelize.define<JoinInstance, JoinAttributes>(
	'join',
	{
		possibleMatches: Sequelize.STRING() + ' CHARSET utf8mb4 COLLATE utf8mb4_bin'
	},
	{
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				unique: true,
				fields: ['guildId', 'memberId', 'createdAt']
			}
		]
	}
);

joins.belongsTo(guilds);
guilds.hasMany(joins);

joins.belongsTo(members);
members.hasMany(joins);

joins.belongsTo(inviteCodes, {
	as: 'exactMatch',
	foreignKey: 'exactMatchCode'
});
inviteCodes.hasMany(joins, { foreignKey: 'exactMatchCode' });

// ------------------------------------
// Leaves
// ------------------------------------
export interface LeaveAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	memberId: string;
	joinId: number;
}
export interface LeaveInstance
	extends Sequelize.Instance<LeaveAttributes>,
		LeaveAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
	getJoin: Sequelize.BelongsToGetAssociationMixin<JoinInstance>;
}

export const leaves = sequelize.define<LeaveInstance, LeaveAttributes>(
	'leave',
	{},
	{
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				unique: true,
				fields: ['guildId', 'memberId', 'joinId']
			}
		]
	}
);

leaves.belongsTo(guilds);
guilds.hasMany(leaves);

leaves.belongsTo(members);
members.hasMany(leaves);

leaves.belongsTo(joins);
joins.hasOne(leaves);

// ------------------------------------
// Custom Invites
// ------------------------------------
export enum CustomInvitesGeneratedReason {
	clear_regular = 'clear_regular',
	clear_custom = 'clear_custom',
	clear_fake = 'clear_fake',
	clear_leave = 'clear_leave',
	fake = 'fake',
	leave = 'leave'
}
export interface CustomInviteAttributes extends BaseAttributes {
	id: number;
	amount: number;
	reason: string;
	generatedReason: CustomInvitesGeneratedReason;
	guildId: string;
	memberId: string;
	creatorId: string;
}
export interface CustomInviteInstance
	extends Sequelize.Instance<CustomInviteAttributes>,
		CustomInviteAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
	getCreator: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const customInvites = sequelize.define<
	CustomInviteInstance,
	CustomInviteAttributes
>(
	'customInvite',
	{
		amount: Sequelize.INTEGER,
		reason: Sequelize.STRING,
		generatedReason: Sequelize.ENUM(
			CustomInvitesGeneratedReason.clear_regular,
			CustomInvitesGeneratedReason.clear_custom,
			CustomInvitesGeneratedReason.clear_fake,
			CustomInvitesGeneratedReason.clear_leave,
			CustomInvitesGeneratedReason.fake,
			CustomInvitesGeneratedReason.leave
		)
	},
	{
		timestamps: true,
		paranoid: true
	}
);

customInvites.belongsTo(guilds);
guilds.hasMany(customInvites);

customInvites.belongsTo(members);
members.hasMany(customInvites);

customInvites.belongsTo(members, { as: 'creator', foreignKey: 'creatorId' });
members.hasMany(customInvites, { foreignKey: 'creatorId' });

// ------------------------------------
// Ranks
// ------------------------------------
export interface RankAttributes extends BaseAttributes {
	id: number;
	roleId: string;
	numInvites: number;
	description: string;
	guildId: string;
}
export interface RankInstance
	extends Sequelize.Instance<RankAttributes>,
		RankAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getRole: Sequelize.BelongsToGetAssociationMixin<RoleInstance>;
}

export const ranks = sequelize.define<RankInstance, RankAttributes>(
	'rank',
	{
		numInvites: Sequelize.INTEGER,
		description: Sequelize.STRING
	},
	{
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				unique: true,
				fields: ['guildId', 'roleId']
			}
		]
	}
);

ranks.belongsTo(guilds);
guilds.hasMany(ranks);

ranks.belongsTo(roles);
roles.hasMany(ranks);

// ------------------------------------
// Presences
// ------------------------------------
export enum PresenceStatus {
	online = 'online',
	offline = 'offline',
	idle = 'idle',
	dnd = 'dnd'
}

export enum GameType {
	playing = 0,
	streaming = 1,
	listening = 2
}

export interface PresenceAttributes extends BaseAttributes {
	id: number;
	status: PresenceStatus;
	type: GameType;
	guildId: string;
	memberId: string;
}
export interface PresenceInstance
	extends Sequelize.Instance<PresenceAttributes>,
		PresenceAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const presences = sequelize.define<PresenceInstance, PresenceAttributes>(
	'presence',
	{
		status: Sequelize.ENUM(
			PresenceStatus.online,
			PresenceStatus.offline,
			PresenceStatus.idle,
			PresenceStatus.dnd
		),
		type: Sequelize.TINYINT,
		game: Sequelize.STRING
	},
	{
		timestamps: true,
		paranoid: true
	}
);

presences.belongsTo(guilds);
guilds.hasMany(presences);

presences.belongsTo(members);
members.hasMany(presences);

// ------------------------------------
// MessageActivity
// ------------------------------------
export interface MessageActivityAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	channelId: string;
	memberId: string;
	amount: number | Sequelize.literal;
	timestamp: Date | number | string | Sequelize.fn;
}
export interface MessageActivityInstance
	extends Sequelize.Instance<MessageActivityAttributes>,
		MessageActivityAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getChannel: Sequelize.BelongsToGetAssociationMixin<ChannelInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const messageActivities = sequelize.define<
	MessageActivityInstance,
	MessageActivityAttributes
>(
	'messageActivity',
	{
		amount: Sequelize.INTEGER,
		timestamp: Sequelize.DATE
	},
	{
		timestamps: true,
		paranoid: true,
		indexes: [
			{
				unique: true,
				fields: ['guildId', 'channelId', 'memberId', 'timestamp']
			}
		]
	}
);

messageActivities.belongsTo(guilds);
guilds.hasMany(messageActivities);

messageActivities.belongsTo(channels);
channels.hasMany(messageActivities);

messageActivities.belongsTo(members);
members.hasMany(messageActivities);

// ------------------------------------
// Logs
// ------------------------------------
export enum LogAction {
	addInvites = 'addInvites',
	clearInvites = 'clearInvites',
	restoreInvites = 'restoreInvites',
	config = 'config',
	memberConfig = 'memberConfig',
	addRank = 'addRank',
	updateRank = 'updateRank',
	removeRank = 'removeRank'
}

export interface LogAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	memberId: string;
	action: LogAction;
	message: string;
	data: any;
}
export interface LogInstance
	extends Sequelize.Instance<LogAttributes>,
		LogAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const logs = sequelize.define<LogInstance, LogAttributes>(
	'log',
	{
		action: Sequelize.ENUM(
			LogAction.addInvites,
			LogAction.addRank,
			LogAction.clearInvites,
			LogAction.config,
			LogAction.memberConfig,
			LogAction.removeRank,
			LogAction.updateRank,
			LogAction.restoreInvites
		),
		message: Sequelize.TEXT,
		data: Sequelize.JSON
	},
	{
		timestamps: true,
		paranoid: true
	}
);

logs.belongsTo(guilds);
guilds.hasMany(logs);

logs.belongsTo(members);
members.hasMany(logs);

// ------------------------------------
// CommandUsage
// ------------------------------------
export interface CommandUsageAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	memberId: string;
	command: string;
	args: string;
	time: number;
}
export interface CommandUsageInstance
	extends Sequelize.Instance<CommandUsageAttributes>,
		CommandUsageAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const commandUsage = sequelize.define<
	CommandUsageInstance,
	CommandUsageAttributes
>(
	'commandUsage',
	{
		command: Sequelize.STRING,
		args: Sequelize.TEXT,
		time: Sequelize.FLOAT
	},
	{
		timestamps: true,
		paranoid: true
	}
);

commandUsage.belongsTo(guilds);
guilds.hasMany(commandUsage);

commandUsage.belongsTo(members);
members.hasMany(commandUsage);

// ------------------------------------
// PremiumSubscriptions
// ------------------------------------
export interface PremiumSubscriptionAttributes extends BaseAttributes {
	id: number;
	amount: number;
	validUntil: Date | number | string;
	guildId: string;
	memberId: string;
}
export interface PremiumSubscriptionInstance
	extends Sequelize.Instance<PremiumSubscriptionAttributes>,
		PremiumSubscriptionAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const premiumSubscriptions = sequelize.define<
	PremiumSubscriptionInstance,
	PremiumSubscriptionAttributes
>(
	'premiumSubscriptions',
	{
		amount: Sequelize.DECIMAL(10, 2),
		validUntil: Sequelize.DATE
	},
	{
		timestamps: true,
		paranoid: true
	}
);

premiumSubscriptions.belongsTo(guilds);
guilds.hasMany(premiumSubscriptions);

premiumSubscriptions.belongsTo(members);
members.hasMany(premiumSubscriptions);

// ------------------------------------
// RolePermssions
// ------------------------------------
export interface RolePermissionsAttributes extends BaseAttributes {
	id: number;
	roleId: string;
	command: string;
}
export interface RolePermissionsInstance
	extends Sequelize.Instance<RolePermissionsAttributes>,
		RolePermissionsAttributes {
	getRole: Sequelize.BelongsToGetAssociationMixin<RoleInstance>;
}

export const rolePermissions = sequelize.define<
	RolePermissionsInstance,
	RolePermissionsAttributes
>(
	'rolePermissions',
	{
		command: Sequelize.STRING(32)
	},
	{
		timestamps: true,
		paranoid: true
	}
);

rolePermissions.belongsTo(roles);
roles.hasMany(rolePermissions);
