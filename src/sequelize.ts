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
		color: Sequelize.STRING({ length: 7 }),
		guildId: Sequelize.STRING(32)
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
		name: Sequelize.STRING,
		guildId: Sequelize.STRING(32)
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
	lang = 'lang',
	getUpdates = 'getUpdates',
	logChannel = 'logChannel',

	joinMessage = 'joinMessage',
	joinMessageChannel = 'joinMessageChannel',
	leaveMessage = 'leaveMessage',
	leaveMessageChannel = 'leaveMessageChannel',

	leaderboardStyle = 'leaderboardStyle',
	hideLeftMembersFromLeaderboard = 'hideLeftMembersFromLeaderboard',

	autoSubtractFakes = 'autoSubtractFakes',
	autoSubtractLeaves = 'autoSubtractLeaves',
	autoSubtractLeaveThreshold = 'autoSubtractLeaveThreshold',

	rankAssignmentStyle = 'rankAssignmentStyle',
	rankAnnouncementChannel = 'rankAnnouncementChannel',
	rankAnnouncementMessage = 'rankAnnouncementMessage',

	mutedRole = 'mutedRole',

	captchaVerificationOnJoin = 'captchaVerificationOnJoin',
	captchaVerificationWelcomeMessage = 'captchaVerificationWelcomeMessage',
	captchaVerificationSuccessMessage = 'captchaVerificationSuccessMessage',
	captchaVerificationFailedMessage = 'captchaVerificationFailedMessage',
	captchaVerificationTimeout = 'captchaVerificationTimeout',
	captchaVerificationLogEnabled = 'captchaVerificationLogEnabled',

	modLogChannel = 'modLogChannel',
	modPunishmentBanDeleteMessage = 'modPunishmentBanDeleteMessage',
	modPunishmentKickDeleteMessage = 'modPunishmentKickDeleteMessage',
	modPunishmentSoftbanDeleteMessage = 'modPunishmentSoftbanDeleteMessage',
	modPunishmentWarnDeleteMessage = 'modPunishmentWarnDeleteMessage',
	modPunishmentMuteDeleteMessage = 'modPunishmentMuteDeleteMessage',

	autoModEnabled = 'autoModEnabled',
	autoModModeratedChannels = 'autoModModeratedChannels',
	autoModModeratedRoles = 'autoModModeratedRoles',
	autoModIgnoredChannels = 'autoModIgnoredChannels',
	autoModIgnoredRoles = 'autoModIgnoredRoles',
	autoModDeleteBotMessage = 'autoModDeleteBotMessage',
	autoModDeleteBotMessageTimeoutInSeconds = 'autoModDeleteBotMessageTimeoutInSeconds',
	autoModLogEnabled = 'autoModLogEnabled',

	autoModDisabledForOldMembers = 'autoModDisabledForOldMembers',
	autoModDisabledForOldMembersThreshold = 'autoModDisabledForOldMembersThreshold',

	autoModInvitesEnabled = 'autoModInvitesEnabled',

	autoModLinksEnabled = 'autoModLinksEnabled',
	autoModLinksWhitelist = 'autoModLinksWhitelist',
	autoModLinksBlacklist = 'autoModLinksBlacklist',
	autoModLinksFollowRedirects = 'autoModLinksFollowRedirects',

	autoModWordsEnabled = 'autoModWordsEnabled',
	autoModWordsBlacklist = 'autoModWordsBlacklist',

	autoModAllCapsEnabled = 'autoModAllCapsEnabled',
	autoModAllCapsMinCharacters = 'autoModAllCapsMinCharacters',
	autoModAllCapsPercentageCaps = 'autoModAllCapsPercentageCaps',

	autoModDuplicateTextEnabled = 'autoModDuplicateTextEnabled',
	autoModDuplicateTextTimeframeInSeconds = 'autoModDuplicateTextTimeframeInSeconds',

	autoModQuickMessagesEnabled = 'autoModQuickMessagesEnabled',
	autoModQuickMessagesNumberOfMessages = 'autoModQuickMessagesNumberOfMessages',
	autoModQuickMessagesTimeframeInSeconds = 'autoModQuickMessagesTimeframeInSeconds',

	autoModMentionUsersEnabled = 'autoModMentionUsersEnabled',
	autoModMentionUsersMaxNumberOfMentions = 'autoModMentionUsersMaxNumberOfMentions',

	autoModMentionRolesEnabled = 'autoModMentionRolesEnabled',
	autoModMentionRolesMaxNumberOfMentions = 'autoModMentionRolesMaxNumberOfMentions',

	autoModEmojisEnabled = 'autoModEmojisEnabled',
	autoModEmojisMaxNumberOfEmojis = 'autoModEmojisMaxNumberOfEmojis',

	autoModHoistEnabled = 'autoModHoistEnabled'
}

export type SettingsObject = {
	prefix: string;
	lang: Lang;
	logChannel: string;
	getUpdates: boolean;

	joinMessage: string;
	joinMessageChannel: string;
	leaveMessage: string;
	leaveMessageChannel: string;

	leaderboardStyle: LeaderboardStyle;
	hideLeftMembersFromLeaderboard: boolean;

	autoSubtractFakes: boolean;
	autoSubtractLeaves: boolean;
	autoSubtractLeaveThreshold: number /* seconds */;

	rankAssignmentStyle: RankAssignmentStyle;
	rankAnnouncementChannel: string;
	rankAnnouncementMessage: string;

	mutedRole: string;

	captchaVerificationOnJoin: boolean;
	captchaVerificationWelcomeMessage: string;
	captchaVerificationSuccessMessage: string;
	captchaVerificationFailedMessage: string;
	captchaVerificationTimeout: number /* seconds */;
	captchaVerificationLogEnabled: boolean;

	modLogChannel: string;
	modPunishmentBanDeleteMessage: boolean;
	modPunishmentKickDeleteMessage: boolean;
	modPunishmentSoftbanDeleteMessage: boolean;
	modPunishmentWarnDeleteMessage: boolean;
	modPunishmentMuteDeleteMessage: boolean;

	autoModEnabled: boolean;
	autoModModeratedChannels: string[];
	autoModModeratedRoles: string[];
	autoModIgnoredChannels: string[];
	autoModIgnoredRoles: string[];
	autoModDeleteBotMessage: boolean;
	autoModDeleteBotMessageTimeoutInSeconds: number;
	autoModLogEnabled: boolean;

	autoModDisabledForOldMembers: boolean;
	autoModDisabledForOldMembersThreshold: number /* seconds, default 1 week */;

	autoModInvitesEnabled: boolean;

	autoModLinksEnabled: boolean;
	autoModLinksWhitelist: string[];
	autoModLinksBlacklist: string[];
	autoModLinksFollowRedirects: boolean;

	autoModWordsEnabled: boolean;
	autoModWordsBlacklist: string[];

	autoModAllCapsEnabled: boolean;
	autoModAllCapsMinCharacters: number;
	autoModAllCapsPercentageCaps: number;

	autoModDuplicateTextEnabled: boolean;
	autoModDuplicateTextTimeframeInSeconds: number;

	autoModQuickMessagesEnabled: boolean;
	autoModQuickMessagesNumberOfMessages: number;
	autoModQuickMessagesTimeframeInSeconds: number;

	autoModMentionUsersEnabled: boolean;
	autoModMentionUsersMaxNumberOfMentions: number;

	autoModMentionRolesEnabled: boolean;
	autoModMentionRolesMaxNumberOfMentions: number;

	autoModEmojisEnabled: boolean;
	autoModEmojisMaxNumberOfEmojis: number;

	autoModHoistEnabled: boolean;
};

export type InternalSettingsTypes =
	| 'String'
	| 'Number'
	| 'Boolean'
	| 'Channel'
	| 'Role'
	| 'String[]'
	| 'Channel[]'
	| 'Role[]'
	| 'Enum<LeaderboardStyle>'
	| 'Enum<RankAssignmentStyle>'
	| 'Enum<Lang>';

export type SettingsTypesObject = { [k in SettingsKey]: InternalSettingsTypes };

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

export const settingsTypes: SettingsTypesObject = {
	prefix: 'String',
	lang: 'Enum<Lang>',
	logChannel: 'Channel',
	getUpdates: 'Boolean',

	joinMessage: 'String',
	joinMessageChannel: 'Channel',
	leaveMessage: 'String',
	leaveMessageChannel: 'Channel',

	leaderboardStyle: 'Enum<LeaderboardStyle>',
	hideLeftMembersFromLeaderboard: 'Boolean',

	autoSubtractFakes: 'Boolean',
	autoSubtractLeaves: 'Boolean',
	autoSubtractLeaveThreshold: 'Number' /* seconds */,

	rankAssignmentStyle: 'Enum<RankAssignmentStyle>',
	rankAnnouncementChannel: 'Channel',
	rankAnnouncementMessage: 'String',

	mutedRole: 'Role',

	captchaVerificationOnJoin: 'Boolean',
	captchaVerificationWelcomeMessage: 'String',
	captchaVerificationSuccessMessage: 'String',
	captchaVerificationFailedMessage: 'String',
	captchaVerificationTimeout: 'Number' /* seconds */,
	captchaVerificationLogEnabled: 'Boolean',

	modLogChannel: 'Channel',
	modPunishmentBanDeleteMessage: 'Boolean',
	modPunishmentKickDeleteMessage: 'Boolean',
	modPunishmentSoftbanDeleteMessage: 'Boolean',
	modPunishmentWarnDeleteMessage: 'Boolean',
	modPunishmentMuteDeleteMessage: 'Boolean',

	autoModEnabled: 'Boolean',
	autoModModeratedChannels: 'Channel[]',
	autoModModeratedRoles: 'Role[]',
	autoModIgnoredChannels: 'Channel[]',
	autoModIgnoredRoles: 'Role[]',
	autoModDeleteBotMessage: 'Boolean',
	autoModDeleteBotMessageTimeoutInSeconds: 'Number',
	autoModLogEnabled: 'Boolean',

	autoModDisabledForOldMembers: 'Boolean',
	autoModDisabledForOldMembersThreshold: 'Number' /* seconds, default 1 week */,

	autoModInvitesEnabled: 'Boolean',

	autoModLinksEnabled: 'Boolean',
	autoModLinksWhitelist: 'String[]',
	autoModLinksBlacklist: 'String[]',
	autoModLinksFollowRedirects: 'Boolean',

	autoModWordsEnabled: 'Boolean',
	autoModWordsBlacklist: 'String[]',

	autoModAllCapsEnabled: 'Boolean',
	autoModAllCapsMinCharacters: 'Number',
	autoModAllCapsPercentageCaps: 'Number',

	autoModDuplicateTextEnabled: 'Boolean',
	autoModDuplicateTextTimeframeInSeconds: 'Number',

	autoModQuickMessagesEnabled: 'Boolean',
	autoModQuickMessagesNumberOfMessages: 'Number',
	autoModQuickMessagesTimeframeInSeconds: 'Number',

	autoModMentionUsersEnabled: 'Boolean',
	autoModMentionUsersMaxNumberOfMentions: 'Number',

	autoModMentionRolesEnabled: 'Boolean',
	autoModMentionRolesMaxNumberOfMentions: 'Number',

	autoModEmojisEnabled: 'Boolean',
	autoModEmojisMaxNumberOfEmojis: 'Number',

	autoModHoistEnabled: 'Boolean'
};

export const defaultSettings: SettingsObject = {
	prefix: '!',
	lang: Lang.en,
	logChannel: null,
	getUpdates: true,

	joinMessage:
		'{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)',
	joinMessageChannel: null,
	leaveMessage: '{memberName} **left**; Invited by **{inviterName}**',
	leaveMessageChannel: null,

	leaderboardStyle: LeaderboardStyle.normal,
	hideLeftMembersFromLeaderboard: true,

	autoSubtractFakes: true,
	autoSubtractLeaves: true,
	autoSubtractLeaveThreshold: 600 /* seconds */,

	rankAssignmentStyle: RankAssignmentStyle.all,
	rankAnnouncementChannel: null,
	rankAnnouncementMessage:
		'Congratulations, **{memberMention}** has reached the **{rankName}** rank!',

	mutedRole: null,

	captchaVerificationOnJoin: false,
	captchaVerificationWelcomeMessage:
		'Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.',
	captchaVerificationSuccessMessage:
		'You have successfully entered the captcha. Welcome to the server!',
	captchaVerificationFailedMessage:
		'You did not enter the captha right within the specified time.' +
		`We're sorry, but we have to kick you from the server. Feel free to join again.`,
	captchaVerificationTimeout: 180 /* seconds */,
	captchaVerificationLogEnabled: true,

	modLogChannel: null,
	modPunishmentBanDeleteMessage: true,
	modPunishmentKickDeleteMessage: true,
	modPunishmentSoftbanDeleteMessage: true,
	modPunishmentWarnDeleteMessage: true,
	modPunishmentMuteDeleteMessage: true,

	autoModEnabled: false,
	autoModModeratedChannels: [],
	autoModModeratedRoles: [],
	autoModIgnoredChannels: [],
	autoModIgnoredRoles: [],
	autoModDeleteBotMessage: true,
	autoModDeleteBotMessageTimeoutInSeconds: 5,
	autoModLogEnabled: true,

	autoModDisabledForOldMembers: false,
	autoModDisabledForOldMembersThreshold: 604800 /* seconds, default 1 week */,

	autoModInvitesEnabled: true,

	autoModLinksEnabled: true,
	autoModLinksWhitelist: [],
	autoModLinksBlacklist: [],
	autoModLinksFollowRedirects: true,

	autoModWordsEnabled: true,
	autoModWordsBlacklist: [],

	autoModAllCapsEnabled: true,
	autoModAllCapsMinCharacters: 10,
	autoModAllCapsPercentageCaps: 70,

	autoModDuplicateTextEnabled: true,
	autoModDuplicateTextTimeframeInSeconds: 60,

	autoModQuickMessagesEnabled: true,
	autoModQuickMessagesNumberOfMessages: 5,
	autoModQuickMessagesTimeframeInSeconds: 3,

	autoModMentionUsersEnabled: true,
	autoModMentionUsersMaxNumberOfMentions: 5,

	autoModMentionRolesEnabled: true,
	autoModMentionRolesMaxNumberOfMentions: 3,

	autoModEmojisEnabled: true,
	autoModEmojisMaxNumberOfEmojis: 5,

	autoModHoistEnabled: true
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
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		key: Sequelize.ENUM(Object.values(SettingsKey)),
		value: Sequelize.TEXT,
		guildId: Sequelize.STRING(32)
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

export type MemberSettingsObject = {
	hideFromLeaderboard: boolean;
};

export type MemberSettingsTypesObject = {
	[k in MemberSettingsKey]: InternalSettingsTypes
};

export const memberSettingsTypes: MemberSettingsTypesObject = {
	hideFromLeaderboard: 'Boolean'
};

export const defaultMemberSettings: MemberSettingsObject = {
	hideFromLeaderboard: false
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
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		key: Sequelize.ENUM(Object.values(MemberSettingsKey)),
		value: Sequelize.TEXT,
		guildId: Sequelize.STRING(32),
		memberId: Sequelize.STRING(32)
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
		temporary: Sequelize.BOOLEAN,
		channelId: Sequelize.STRING(32),
		guildId: Sequelize.STRING(32),
		inviterId: Sequelize.STRING(32)
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

export type InviteCodeSettingsObject = {
	name: string;
	roles: string[];
};

export type InviteCodeSettingsTypesObject = {
	[k in InviteCodeSettingsKey]: InternalSettingsTypes
};

export const inviteCodeSettingsTypes: InviteCodeSettingsTypesObject = {
	name: 'String',
	roles: 'Role[]'
};

export const defaultInviteCodeSettings: InviteCodeSettingsObject = {
	name: null,
	roles: []
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
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		key: Sequelize.ENUM(Object.values(InviteCodeSettingsKey)),
		value: Sequelize.TEXT,
		guildId: Sequelize.STRING(32),
		inviteCode: Sequelize.STRING() + ' CHARSET utf8mb4 COLLATE utf8mb4_bin'
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
}
export interface JoinInstance
	extends Sequelize.Instance<JoinAttributes>,
		JoinAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
	getExactMatch: Sequelize.BelongsToGetAssociationMixin<InviteCodeInstance>;
}

export const joins = sequelize.define<JoinInstance, JoinAttributes>(
	'join',
	{
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		possibleMatches:
			Sequelize.STRING() + ' CHARSET utf8mb4 COLLATE utf8mb4_bin',
		exactMatchCode: Sequelize.STRING() + ' CHARSET utf8mb4 COLLATE utf8mb4_bin',
		guildId: Sequelize.STRING(32),
		memberId: Sequelize.STRING(32)
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
	{
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		guildId: Sequelize.STRING(32),
		memberId: Sequelize.STRING(32),
		joinId: Sequelize.INTEGER
	},
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
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		amount: Sequelize.INTEGER,
		reason: Sequelize.STRING,
		generatedReason: Sequelize.ENUM(
			Object.values(CustomInvitesGeneratedReason)
		),
		guildId: Sequelize.STRING(32),
		memberId: Sequelize.STRING(32),
		creatorId: Sequelize.STRING(32)
	},
	{
		timestamps: true,
		paranoid: false
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
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		numInvites: Sequelize.INTEGER,
		description: Sequelize.STRING,
		guildId: Sequelize.STRING(32),
		roleId: Sequelize.STRING(32)
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
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		status: Sequelize.ENUM(Object.values(PresenceStatus)),
		type: Sequelize.TINYINT,
		guildId: Sequelize.STRING(32),
		memberId: Sequelize.STRING(32)
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
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		amount: Sequelize.INTEGER,
		timestamp: Sequelize.DATE,
		guildId: Sequelize.STRING(32),
		memberId: Sequelize.STRING(32),
		channelId: Sequelize.STRING(32)
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
	removeRank = 'removeRank',
	owner = 'owner'
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
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		action: Sequelize.ENUM(Object.values(LogAction)),
		message: Sequelize.TEXT,
		data: Sequelize.JSON,
		guildId: Sequelize.STRING(32),
		memberId: Sequelize.STRING(32)
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
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		command: Sequelize.STRING,
		args: Sequelize.TEXT,
		time: Sequelize.FLOAT,
		guildId: Sequelize.STRING(32),
		memberId: Sequelize.STRING(32)
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
	maxGuilds: number;
	isFreeTier: boolean;
	validUntil: Date | number | string;
	memberId: string;
	reason: string;
}
export interface PremiumSubscriptionInstance
	extends Sequelize.Instance<PremiumSubscriptionAttributes>,
		PremiumSubscriptionAttributes {
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const premiumSubscriptions = sequelize.define<
	PremiumSubscriptionInstance,
	PremiumSubscriptionAttributes
>(
	'premiumSubscriptions',
	{
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		amount: Sequelize.DECIMAL(10, 2),
		maxGuilds: Sequelize.INTEGER,
		isFreeTier: Sequelize.BOOLEAN,
		validUntil: Sequelize.DATE,
		memberId: Sequelize.STRING(32),
		reason: Sequelize.TEXT
	},
	{
		timestamps: true,
		paranoid: true
	}
);

premiumSubscriptions.belongsTo(members);
members.hasMany(premiumSubscriptions);

// ------------------------------------
// PremiumSubscriptionGuilds
// ------------------------------------
export interface PremiumSubscriptionGuildAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	premiumSubscriptionId: number;
}
export interface PremiumSubscriptionGuildInstance
	extends Sequelize.Instance<PremiumSubscriptionGuildAttributes>,
		PremiumSubscriptionGuildAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getPremiumSubscription: Sequelize.BelongsToGetAssociationMixin<
		PremiumSubscriptionInstance
	>;
}

export const premiumSubscriptionGuilds = sequelize.define<
	PremiumSubscriptionGuildAttributes,
	PremiumSubscriptionGuildAttributes
>(
	'premiumSubscriptionGuilds',
	{
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		guildId: Sequelize.STRING(32),
		premiumSubscriptionId: Sequelize.INTEGER
	},
	{
		timestamps: true,
		paranoid: true
	}
);

premiumSubscriptionGuilds.belongsTo(guilds);
guilds.hasMany(premiumSubscriptionGuilds);

premiumSubscriptionGuilds.belongsTo(premiumSubscriptions);
premiumSubscriptions.hasMany(premiumSubscriptionGuilds);

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
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		command: Sequelize.STRING(32),
		roleId: Sequelize.STRING(32)
	},
	{
		timestamps: true,
		paranoid: true
	}
);

rolePermissions.belongsTo(roles);
roles.hasMany(rolePermissions);

// ------------------------------------
// StrikesConfig
// ------------------------------------
export enum ViolationType {
	invites = 'invites',
	links = 'links',
	words = 'words',
	allCaps = 'allCaps',
	duplicateText = 'duplicateText',
	quickMessages = 'quickMessages',
	mentionUsers = 'mentionUsers',
	mentionRoles = 'mentionRoles',
	emojis = 'emojis',
	hoist = 'hoist'
}

export interface StrikeConfigAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	type: ViolationType;
	amount: number;
}
export interface StrikeConfigInstance
	extends Sequelize.Instance<StrikeConfigAttributes>,
		StrikeConfigAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
}

export const strikeConfigs = sequelize.define<
	StrikeConfigInstance,
	StrikeConfigAttributes
>(
	'strikeConfig',
	{
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		type: Sequelize.ENUM(Object.values(ViolationType)),
		amount: Sequelize.INTEGER,
		guildId: Sequelize.STRING(32)
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['guildId', 'type']
			}
		]
	}
);

strikeConfigs.belongsTo(guilds);
guilds.hasMany(strikeConfigs);

// ------------------------------------
// Strikes
// ------------------------------------
export interface StrikeAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	memberId: string;
	amount: number;
	type: ViolationType;
}
export interface StrikeInstance
	extends Sequelize.Instance<StrikeAttributes>,
		StrikeAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const strikes = sequelize.define<StrikeInstance, StrikeAttributes>(
	'strike',
	{
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		amount: Sequelize.INTEGER,
		type: Sequelize.ENUM(Object.values(ViolationType)),
		guildId: Sequelize.STRING(32),
		memberId: Sequelize.STRING(32)
	}
);

strikes.belongsTo(guilds);
guilds.hasMany(strikes);

strikes.belongsTo(members);
members.hasMany(strikes);

// ------------------------------------
// PunishmentConfigs
// ------------------------------------
export enum PunishmentType {
	ban = 'ban',
	kick = 'kick',
	softban = 'softban',
	warn = 'warn',
	mute = 'mute'
}

export interface PunishmentConfigAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	type: PunishmentType;
	amount: number;
	args: string;
}
export interface PunishmentConfigInstance
	extends Sequelize.Instance<PunishmentConfigAttributes>,
		PunishmentConfigAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
}

export const punishmentConfigs = sequelize.define<
	PunishmentConfigInstance,
	PunishmentConfigAttributes
>(
	'punishmentConfig',
	{
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		type: Sequelize.ENUM(Object.values(PunishmentType)),
		amount: Sequelize.INTEGER,
		args: Sequelize.STRING,
		guildId: Sequelize.STRING(32)
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['guildId', 'type']
			}
		]
	}
);

punishmentConfigs.belongsTo(guilds);
guilds.hasMany(punishmentConfigs);

// ------------------------------------
// Punishments
// ------------------------------------
export interface PunishmentAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	memberId: string;
	type: PunishmentType;
	amount: number;
	args: string;
	reason: string;
	creatorId: string;
}
export interface PunishmentInstance
	extends Sequelize.Instance<PunishmentAttributes>,
		PunishmentAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const punishments = sequelize.define<
	PunishmentInstance,
	PunishmentAttributes
>('punishment', {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	type: Sequelize.ENUM(Object.values(PunishmentType)),
	amount: Sequelize.INTEGER,
	args: Sequelize.STRING,
	guildId: Sequelize.STRING(32),
	memberId: Sequelize.STRING(32),
	creatorId: Sequelize.STRING(32),
	reason: Sequelize.STRING
});

punishments.belongsTo(guilds);
guilds.hasMany(punishments);

punishments.belongsTo(members);
members.hasMany(punishments);

punishments.belongsTo(members, { as: 'creator', foreignKey: 'creatorId' });
members.hasMany(punishments, { foreignKey: 'creatorId' });

// ------------------------------------
// Scheduled Actions
// ------------------------------------

export enum ScheduledActionType {
	unmute = 'unmute'
}

export interface ScheduledActionAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	actionType: ScheduledActionType;
	args: JSON;
	reason: string;
	date: Date;
}
export interface ScheduledActionInstance
	extends Sequelize.Instance<ScheduledActionAttributes>,
		ScheduledActionAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
}

export const scheduledActions = sequelize.define<
	ScheduledActionInstance,
	ScheduledActionAttributes
>('scheduledAction', {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	actionType: Sequelize.ENUM(Object.values(ScheduledActionType)),
	args: Sequelize.JSON,
	date: Sequelize.DATE,
	reason: Sequelize.STRING,
	guildId: Sequelize.STRING(32)
});

scheduledActions.belongsTo(guilds);
guilds.hasMany(scheduledActions);

// ------------------------------------
// Reports
// ------------------------------------

export enum ReportType {
	fraud = 'fraud'
}

export interface ReportAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	reportType: ReportType;
	description: string;
}
export interface ReportInstance
	extends Sequelize.Instance<ReportAttributes>,
		ReportAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
}

export const reports = sequelize.define<ReportInstance, ReportAttributes>(
	'report',
	{
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		reportType: Sequelize.ENUM(Object.values(ReportType)),
		description: Sequelize.TEXT,
		guildId: Sequelize.STRING(32)
	}
);

reports.belongsTo(guilds);
guilds.hasMany(reports);
