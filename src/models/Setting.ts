import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { SettingsObject } from '../settings';

import { Guild } from './Guild';

export enum SettingsKey {
	prefix = 'prefix',
	lang = 'lang',
	getUpdates = 'getUpdates',
	logChannel = 'logChannel',
	channels = 'channels',
	ignoredChannels = 'ignoredChannels',

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

	autoModHoistEnabled = 'autoModHoistEnabled',

	musicVolume = 'musicVolume',

	announceNextSong = 'announceNextSong',
	announcementVoice = 'announcementVoice',

	fadeMusicOnTalk = 'fadeMusicOnTalk',
	fadeMusicEndDelay = 'fadeMusicEndDelay'
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

export enum AnnouncementVoice {
	Joanna = 'Joanna',
	Salli = 'Salli',
	Kendra = 'Kendra',
	Kimberly = 'Kimberly',
	Ivy = 'Ivy',
	Matthew = 'Matthew',
	Justin = 'Justin',
	Joey = 'Joey'
}

@Entity()
export class Setting {
	@PrimaryGeneratedColumn()
	public id: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ length: 32, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.settings, { nullable: false })
	public guild: Guild;

	@Column({ type: 'json' })
	public value: SettingsObject;
}
