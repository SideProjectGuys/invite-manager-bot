import { GuildSettingsObject } from '../../settings';

export enum GuildSettingsKey {
	// General
	prefix = 'prefix',
	lang = 'lang',
	getUpdates = 'getUpdates',
	logChannel = 'logChannel',
	channels = 'channels',
	ignoredChannels = 'ignoredChannels',

	// Join and leave
	joinRoles = 'joinRoles',
	joinMessage = 'joinMessage',
	joinMessageChannel = 'joinMessageChannel',
	leaveMessage = 'leaveMessage',
	leaveMessageChannel = 'leaveMessageChannel',

	// Leaderboard
	leaderboardStyle = 'leaderboardStyle',
	hideLeftMembersFromLeaderboard = 'hideLeftMembersFromLeaderboard',

	// Fakes and leaves
	autoSubtractFakes = 'autoSubtractFakes',
	autoSubtractLeaves = 'autoSubtractLeaves',
	autoSubtractLeaveThreshold = 'autoSubtractLeaveThreshold',

	// Ranks
	rankAssignmentStyle = 'rankAssignmentStyle',
	rankAnnouncementChannel = 'rankAnnouncementChannel',
	rankAnnouncementMessage = 'rankAnnouncementMessage',

	// Muted
	mutedRole = 'mutedRole',

	// Captcha
	captchaVerificationOnJoin = 'captchaVerificationOnJoin',
	captchaVerificationWelcomeMessage = 'captchaVerificationWelcomeMessage',
	captchaVerificationSuccessMessage = 'captchaVerificationSuccessMessage',
	captchaVerificationFailedMessage = 'captchaVerificationFailedMessage',
	captchaVerificationTimeout = 'captchaVerificationTimeout',
	captchaVerificationLogEnabled = 'captchaVerificationLogEnabled',

	// Moderation - Meta
	modLogChannel = 'modLogChannel',
	modPunishmentBanDeleteMessage = 'modPunishmentBanDeleteMessage',
	modPunishmentKickDeleteMessage = 'modPunishmentKickDeleteMessage',
	modPunishmentSoftbanDeleteMessage = 'modPunishmentSoftbanDeleteMessage',
	modPunishmentWarnDeleteMessage = 'modPunishmentWarnDeleteMessage',
	modPunishmentMuteDeleteMessage = 'modPunishmentMuteDeleteMessage',

	// Moderation - General
	autoModEnabled = 'autoModEnabled',
	autoModModeratedChannels = 'autoModModeratedChannels',
	autoModModeratedRoles = 'autoModModeratedRoles',
	autoModIgnoredChannels = 'autoModIgnoredChannels',
	autoModIgnoredRoles = 'autoModIgnoredRoles',
	autoModDeleteBotMessage = 'autoModDeleteBotMessage',
	autoModDeleteBotMessageTimeoutInSeconds = 'autoModDeleteBotMessageTimeoutInSeconds',
	autoModLogEnabled = 'autoModLogEnabled',

	// Moderation - Old members
	autoModDisabledForOldMembers = 'autoModDisabledForOldMembers',
	autoModDisabledForOldMembersThreshold = 'autoModDisabledForOldMembersThreshold',

	// Moderation - Invites
	autoModInvitesEnabled = 'autoModInvitesEnabled',

	// Moderation - Links
	autoModLinksEnabled = 'autoModLinksEnabled',
	autoModLinksWhitelist = 'autoModLinksWhitelist',
	autoModLinksBlacklist = 'autoModLinksBlacklist',
	autoModLinksFollowRedirects = 'autoModLinksFollowRedirects',

	// Moderation - Words
	autoModWordsEnabled = 'autoModWordsEnabled',
	autoModWordsBlacklist = 'autoModWordsBlacklist',

	// Moderation - CAPS
	autoModAllCapsEnabled = 'autoModAllCapsEnabled',
	autoModAllCapsMinCharacters = 'autoModAllCapsMinCharacters',
	autoModAllCapsPercentageCaps = 'autoModAllCapsPercentageCaps',

	// Moderation - Duplicate text
	autoModDuplicateTextEnabled = 'autoModDuplicateTextEnabled',
	autoModDuplicateTextTimeframeInSeconds = 'autoModDuplicateTextTimeframeInSeconds',

	// Moderation - Quick messages
	autoModQuickMessagesEnabled = 'autoModQuickMessagesEnabled',
	autoModQuickMessagesNumberOfMessages = 'autoModQuickMessagesNumberOfMessages',
	autoModQuickMessagesTimeframeInSeconds = 'autoModQuickMessagesTimeframeInSeconds',

	// Moderation - User mentions
	autoModMentionUsersEnabled = 'autoModMentionUsersEnabled',
	autoModMentionUsersMaxNumberOfMentions = 'autoModMentionUsersMaxNumberOfMentions',

	// Moderation - Role mentions
	autoModMentionRolesEnabled = 'autoModMentionRolesEnabled',
	autoModMentionRolesMaxNumberOfMentions = 'autoModMentionRolesMaxNumberOfMentions',

	// Moderation - Emojis
	autoModEmojisEnabled = 'autoModEmojisEnabled',
	autoModEmojisMaxNumberOfEmojis = 'autoModEmojisMaxNumberOfEmojis',

	// Moderation - Hoist
	autoModHoistEnabled = 'autoModHoistEnabled',

	// Music - General
	musicVolume = 'musicVolume',

	// Music - Announcements
	announceNextSong = 'announceNextSong',
	announcementVoice = 'announcementVoice',

	// Music - Fade on talk
	fadeMusicOnTalk = 'fadeMusicOnTalk',
	fadeMusicEndDelay = 'fadeMusicEndDelay',

	// Music - Platforms
	defaultMusicPlatform = 'defaultMusicPlatform',
	disabledMusicPlatforms = 'disabledMusicPlatforms'
}

export enum Lang {
	ar = 'ar',
	bg = 'bg',
	cs = 'cs',
	de = 'de',
	el = 'el',
	en = 'en',
	es = 'es',
	fr = 'fr',
	hu = 'hu',
	id_ID = 'id_ID',
	it = 'it',
	ja = 'ja',
	lt = 'lt',
	nl = 'nl',
	pl = 'pl',
	pt = 'pt',
	pt_BR = 'pt_BR',
	ro = 'ro',
	ru = 'ru',
	sr = 'sr',
	tr = 'tr',
	zh_CN = 'zh_CN',
	zh_TW = 'zh_TW'
}

export enum LeaderboardStyle {
	normal = 'normal',
	table = 'table',
	mentions = 'mentions'
}

export enum RankAssignmentStyle {
	all = 'all',
	highest = 'highest',
	onlyAdd = 'onlyAdd'
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

export class GuildSetting {
	public guildId: string;
	public createdAt?: Date;
	public updatedAt?: Date;
	public value: GuildSettingsObject;
}
