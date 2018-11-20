import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

import { InternalSettingsTypes } from '../types';

import { Guild } from './Guild';

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
	autoModEmojisMaxNumberOfEmojis = 'autoModEmojisMaxNumberOfEmojis'
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
};

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
	autoModEmojisMaxNumberOfEmojis: 'Number'
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
	autoModModeratedChannels: null,
	autoModModeratedRoles: null,
	autoModIgnoredChannels: null,
	autoModIgnoredRoles: null,
	autoModDeleteBotMessage: true,
	autoModDeleteBotMessageTimeoutInSeconds: 5,
	autoModLogEnabled: true,

	autoModDisabledForOldMembers: false,
	autoModDisabledForOldMembersThreshold: 604800 /* seconds, default 1 week */,

	autoModInvitesEnabled: true,

	autoModLinksEnabled: true,
	autoModLinksWhitelist: null,
	autoModLinksBlacklist: null,
	autoModLinksFollowRedirects: true,

	autoModWordsEnabled: true,
	autoModWordsBlacklist: null,

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
	autoModEmojisMaxNumberOfEmojis: 5
};

@Entity()
export class Setting extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column()
	public key: SettingsKey;

	@Column({ type: 'text' })
	public value: string;

	@Column({ nullable: true })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.settings)
	public guild: Guild;
}
