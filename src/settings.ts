import { Channel, Role } from 'eris';

import { ActivityStatus, ActivityType, BotSettingsKey } from './framework/models/BotSetting';
import {
	AnnouncementVoice,
	GuildSettingsKey,
	Lang,
	LeaderboardStyle,
	RankAssignmentStyle
} from './framework/models/GuildSetting';
import { InviteCodeSettingsKey } from './framework/models/InviteCodeSetting';
import { MemberSettingsKey } from './framework/models/MemberSetting';
import { MusicPlatformType } from './types';

export type InternalSettingsTypes =
	| 'Boolean'
	| 'Number'
	| 'Date'
	| 'String'
	| 'String[]'
	| 'Channel'
	| 'Channel[]'
	| 'Role'
	| 'Role[]'
	| 'Enum<LeaderboardStyle>'
	| 'Enum<RankAssignmentStyle>'
	| 'Enum<Lang>'
	| 'Enum<AnnouncementVoice>'
	| 'Enum<ActivityStatus>'
	| 'Enum<ActivityType>'
	| 'Enum<MusicPlatformTypes>'
	| 'Enum<MusicPlatformTypes>[]';

export interface SettingsInfo<T> {
	type: InternalSettingsTypes;
	grouping: SettingsGroup[];
	defaultValue: T;
	exampleValues?: string[];
	possibleValues?: string[];
	hasPremiumInfo?: boolean;
	clearable?: boolean;
}

export enum SettingsGroup {
	general = 'general',
	invites = 'invites',
	moderation = 'moderation',
	joins = 'joins',
	leaves = 'leaves',
	leaderboard = 'leaderboard',
	fakes = 'fakes',
	ranks = 'ranks',
	captcha = 'captcha',
	logging = 'logging',
	links = 'links',
	bannedWords = 'bannedWords',
	caps = 'caps',
	duplicate = 'duplicate',
	spam = 'spam',
	mentions = 'mentions',
	emojis = 'emojis',
	music = 'music',
	bot = 'bot',
	fadeMusic = 'fadeMusic',
	announcement = 'announcement',
	platform = 'platform'
}

// ------------------------------------
// GuildSettings
// ------------------------------------
export interface GuildSettingsObject {
	prefix: string;
	lang: Lang;
	logChannel: string;
	getUpdates: boolean;
	channels: string[];
	ignoredChannels: string[];

	joinRoles: string[];
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

	musicVolume: number;

	announceNextSong: boolean;
	announcementVoice: AnnouncementVoice;

	fadeMusicOnTalk: boolean;
	fadeMusicStartDuration: number;
	fadeMusicEndDelay: number;

	defaultMusicPlatform: MusicPlatformType;
	disabledMusicPlatforms: MusicPlatformType[];
}

export const guildSettingsInfo: {
	[k in GuildSettingsKey]: SettingsInfo<GuildSettingsObject[k]>;
} = {
	prefix: {
		type: 'String',
		grouping: [SettingsGroup.general],
		defaultValue: '!',
		exampleValues: ['+', '>']
	},
	lang: {
		type: 'Enum<Lang>',
		grouping: [SettingsGroup.general],
		defaultValue: Lang.en,
		possibleValues: Object.values(Lang)
	},
	logChannel: {
		type: 'Channel',
		grouping: [SettingsGroup.general],
		defaultValue: null,
		exampleValues: ['#channel']
	},
	getUpdates: {
		type: 'Boolean',
		grouping: [SettingsGroup.general],
		defaultValue: true
	},
	channels: {
		type: 'Channel[]',
		grouping: [SettingsGroup.general],
		defaultValue: []
	},
	ignoredChannels: {
		type: 'Channel[]',
		grouping: [SettingsGroup.general],
		defaultValue: []
	},

	joinRoles: {
		type: 'Role[]',
		grouping: [SettingsGroup.invites, SettingsGroup.general],
		defaultValue: []
	},
	joinMessage: {
		type: 'String',
		grouping: [SettingsGroup.invites, SettingsGroup.joins],
		defaultValue: '{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)',
		hasPremiumInfo: true
	},
	joinMessageChannel: {
		type: 'Channel',
		grouping: [SettingsGroup.invites, SettingsGroup.joins],
		defaultValue: null,
		exampleValues: ['#general', '#joins']
	},
	leaveMessage: {
		type: 'String',
		grouping: [SettingsGroup.invites, SettingsGroup.leaves],
		defaultValue: '{memberName} **left**; Invited by **{inviterName}**',
		exampleValues: ['', ''],
		hasPremiumInfo: true
	},
	leaveMessageChannel: {
		type: 'Channel',
		grouping: [SettingsGroup.invites, SettingsGroup.leaves],
		defaultValue: null,
		exampleValues: ['#general', '#leaves']
	},

	leaderboardStyle: {
		type: 'Enum<LeaderboardStyle>',
		grouping: [SettingsGroup.invites, SettingsGroup.leaderboard],
		defaultValue: LeaderboardStyle.normal,
		possibleValues: Object.values(LeaderboardStyle)
	},
	hideLeftMembersFromLeaderboard: {
		type: 'Boolean',
		grouping: [SettingsGroup.invites, SettingsGroup.leaderboard],
		defaultValue: true
	},

	autoSubtractFakes: {
		type: 'Boolean',
		grouping: [SettingsGroup.invites, SettingsGroup.fakes],
		defaultValue: true
	},
	autoSubtractLeaves: {
		type: 'Boolean',
		grouping: [SettingsGroup.invites, SettingsGroup.leaves],
		defaultValue: true
	},

	autoSubtractLeaveThreshold: {
		type: 'Number' /* seconds */,
		grouping: [SettingsGroup.invites, SettingsGroup.leaves],
		defaultValue: 600,
		exampleValues: ['60', '3600']
	},

	rankAssignmentStyle: {
		type: 'Enum<RankAssignmentStyle>',
		grouping: [SettingsGroup.invites, SettingsGroup.ranks],
		defaultValue: RankAssignmentStyle.all,
		possibleValues: Object.values(RankAssignmentStyle)
	},
	rankAnnouncementChannel: {
		type: 'Channel',
		grouping: [SettingsGroup.invites, SettingsGroup.ranks],
		defaultValue: null,
		exampleValues: ['', '']
	},
	rankAnnouncementMessage: {
		type: 'String',
		grouping: [SettingsGroup.invites, SettingsGroup.ranks],
		defaultValue: 'Congratulations, **{memberMention}** has reached the **{rankName}** rank!',
		exampleValues: ['', ''],
		hasPremiumInfo: true
	},

	captchaVerificationOnJoin: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.captcha],
		defaultValue: false,
		hasPremiumInfo: true
	},
	captchaVerificationWelcomeMessage: {
		type: 'String',
		grouping: [SettingsGroup.moderation, SettingsGroup.captcha],
		defaultValue:
			'Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.',
		exampleValues: ['Welcome, please enter the captcha below!'],
		hasPremiumInfo: true
	},
	captchaVerificationSuccessMessage: {
		type: 'String',
		grouping: [SettingsGroup.moderation, SettingsGroup.captcha],
		defaultValue: 'You have successfully entered the captcha. Welcome to the server!',
		exampleValues: ['Thanks for entering the captcha, enjoy our server!'],
		hasPremiumInfo: true
	},
	captchaVerificationFailedMessage: {
		type: 'String',
		grouping: [SettingsGroup.moderation, SettingsGroup.captcha],
		defaultValue:
			'You did not enter the captha right within the specified time.' +
			`We're sorry, but we have to kick you from the server. Feel free to join again.`,
		exampleValues: ['Looks like you are not human :(. You can join again and try again later if this was a mistake!'],
		hasPremiumInfo: true
	},
	captchaVerificationTimeout: {
		type: 'Number' /* seconds */,
		grouping: [SettingsGroup.moderation, SettingsGroup.captcha],
		defaultValue: 180,
		exampleValues: ['60', '600'],
		hasPremiumInfo: true
	},
	captchaVerificationLogEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.captcha],
		defaultValue: true,
		hasPremiumInfo: true
	},

	autoModEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.general],
		defaultValue: false
	},
	autoModModeratedChannels: {
		type: 'Channel[]',
		grouping: [SettingsGroup.moderation, SettingsGroup.general],
		defaultValue: [],
		exampleValues: ['#general', '#support,#help']
	},
	autoModModeratedRoles: {
		type: 'Role[]',
		grouping: [SettingsGroup.moderation, SettingsGroup.general],
		defaultValue: [],
		exampleValues: ['@NewMembers', '@Newbies,@Starters']
	},
	autoModIgnoredChannels: {
		type: 'Channel[]',
		grouping: [SettingsGroup.moderation, SettingsGroup.general],
		defaultValue: [],
		exampleValues: ['#general', '#off-topic,#nsfw']
	},
	autoModIgnoredRoles: {
		type: 'Role[]',
		grouping: [SettingsGroup.moderation, SettingsGroup.general],
		defaultValue: [],
		exampleValues: ['@TrustedMembers', '@Moderators,@Staff']
	},
	mutedRole: {
		type: 'Role',
		grouping: [SettingsGroup.moderation, SettingsGroup.general],
		defaultValue: null,
		exampleValues: ['@muted']
	},
	autoModDisabledForOldMembers: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.general],
		defaultValue: false
	},
	autoModDisabledForOldMembersThreshold: {
		type: 'Number' /* seconds */,
		grouping: [SettingsGroup.moderation, SettingsGroup.general],
		defaultValue: 604800 /* 1 week */,
		exampleValues: ['604800` (1 week)`', '2419200` (1 month)`']
	},

	autoModLogEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.logging],
		defaultValue: true
	},
	modLogChannel: {
		type: 'Channel',
		grouping: [SettingsGroup.moderation, SettingsGroup.logging],
		defaultValue: null,
		exampleValues: ['#channel', '#logs']
	},
	autoModDeleteBotMessage: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.logging],
		defaultValue: true
	},
	autoModDeleteBotMessageTimeoutInSeconds: {
		type: 'Number',
		grouping: [SettingsGroup.moderation, SettingsGroup.logging],
		defaultValue: 5,
		exampleValues: ['5', '10']
	},
	modPunishmentBanDeleteMessage: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.logging],
		defaultValue: true
	},
	modPunishmentKickDeleteMessage: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.logging],
		defaultValue: true
	},
	modPunishmentSoftbanDeleteMessage: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.logging],
		defaultValue: true
	},
	modPunishmentWarnDeleteMessage: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.logging],
		defaultValue: true
	},
	modPunishmentMuteDeleteMessage: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.logging],
		defaultValue: true
	},

	autoModInvitesEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.invites],
		defaultValue: true
	},

	autoModLinksEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.links],
		defaultValue: true
	},
	autoModLinksWhitelist: {
		type: 'String[]',
		grouping: [SettingsGroup.moderation, SettingsGroup.links],
		defaultValue: [],
		exampleValues: ['discordbots.org', 'youtube.com,twitch.com']
	},
	autoModLinksBlacklist: {
		type: 'String[]',
		grouping: [SettingsGroup.moderation, SettingsGroup.links],
		defaultValue: [],
		exampleValues: ['google.com', 'twitch.com,youtube.com']
	},
	autoModLinksFollowRedirects: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.links],
		defaultValue: true,
		hasPremiumInfo: true
	},

	autoModWordsEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.bannedWords],
		defaultValue: true
	},
	autoModWordsBlacklist: {
		type: 'String[]',
		grouping: [SettingsGroup.moderation, SettingsGroup.bannedWords],
		defaultValue: [],
		exampleValues: ['gay', 'stupid,fuck']
	},

	autoModAllCapsEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.caps],
		defaultValue: true
	},
	autoModAllCapsMinCharacters: {
		type: 'Number',
		grouping: [SettingsGroup.moderation, SettingsGroup.caps],
		defaultValue: 10,
		exampleValues: ['5', '15']
	},
	autoModAllCapsPercentageCaps: {
		type: 'Number',
		grouping: [SettingsGroup.moderation, SettingsGroup.caps],
		defaultValue: 70,
		exampleValues: ['50', '90']
	},

	autoModDuplicateTextEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.duplicate],
		defaultValue: true
	},
	autoModDuplicateTextTimeframeInSeconds: {
		type: 'Number',
		grouping: [SettingsGroup.moderation, SettingsGroup.duplicate],
		defaultValue: 60,
		exampleValues: ['5', '20']
	},

	autoModQuickMessagesEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.spam],
		defaultValue: true
	},
	autoModQuickMessagesNumberOfMessages: {
		type: 'Number',
		grouping: [SettingsGroup.moderation, SettingsGroup.spam],
		defaultValue: 5,
		exampleValues: ['5', '10']
	},
	autoModQuickMessagesTimeframeInSeconds: {
		type: 'Number',
		grouping: [SettingsGroup.moderation, SettingsGroup.spam],
		defaultValue: 3,
		exampleValues: ['2', '10']
	},

	autoModMentionUsersEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.mentions],
		defaultValue: true
	},
	autoModMentionUsersMaxNumberOfMentions: {
		type: 'Number',
		grouping: [SettingsGroup.moderation, SettingsGroup.mentions],
		defaultValue: 5,
		exampleValues: ['2', '5']
	},
	autoModMentionRolesEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.mentions],
		defaultValue: true
	},
	autoModMentionRolesMaxNumberOfMentions: {
		type: 'Number',
		grouping: [SettingsGroup.moderation, SettingsGroup.mentions],
		defaultValue: 3,
		exampleValues: ['2', '5']
	},

	autoModEmojisEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.emojis],
		defaultValue: true
	},
	autoModEmojisMaxNumberOfEmojis: {
		type: 'Number',
		grouping: [SettingsGroup.moderation, SettingsGroup.emojis],
		defaultValue: 5,
		exampleValues: ['5', '10']
	},

	autoModHoistEnabled: {
		type: 'Boolean',
		grouping: [SettingsGroup.moderation, SettingsGroup.emojis],
		defaultValue: true
	},

	musicVolume: {
		type: 'Number',
		grouping: [SettingsGroup.music, SettingsGroup.general],
		defaultValue: 100
	},

	announceNextSong: {
		type: 'Boolean',
		grouping: [SettingsGroup.music, SettingsGroup.announcement],
		defaultValue: true
	},
	announcementVoice: {
		type: 'Enum<AnnouncementVoice>',
		grouping: [SettingsGroup.music, SettingsGroup.announcement],
		defaultValue: AnnouncementVoice.Joanna,
		possibleValues: Object.values(AnnouncementVoice)
	},

	fadeMusicOnTalk: {
		type: 'Boolean',
		grouping: [SettingsGroup.music, SettingsGroup.fadeMusic],
		defaultValue: true
	},
	fadeMusicEndDelay: {
		type: 'Number',
		grouping: [SettingsGroup.music, SettingsGroup.fadeMusic],
		defaultValue: 1.0
	},

	defaultMusicPlatform: {
		type: 'Enum<MusicPlatformTypes>',
		grouping: [SettingsGroup.music, SettingsGroup.platform],
		defaultValue: MusicPlatformType.SoundCloud
	},
	disabledMusicPlatforms: {
		type: 'Enum<MusicPlatformTypes>[]',
		grouping: [SettingsGroup.music, SettingsGroup.platform],
		defaultValue: []
	}
};

export const guildDefaultSettings: GuildSettingsObject = {} as any;
Object.keys(guildSettingsInfo).forEach((k: GuildSettingsKey) => {
	const info = guildSettingsInfo[k];
	info.clearable = info.type.endsWith('[]') || info.defaultValue === null;
	(guildDefaultSettings[k] as any) = guildSettingsInfo[k].defaultValue;
});

// ------------------------------------
// Member Settings
// ------------------------------------
export interface MemberSettingsObject {
	[MemberSettingsKey.hideFromLeaderboard]: boolean;
}

export const memberSettingsInfo: {
	[k in MemberSettingsKey]: SettingsInfo<MemberSettingsObject[k]>;
} = {
	[MemberSettingsKey.hideFromLeaderboard]: {
		type: 'Boolean',
		grouping: [SettingsGroup.invites],
		defaultValue: false
	}
};

export const memberDefaultSettings: MemberSettingsObject = {} as any;
Object.keys(memberSettingsInfo).forEach((k: MemberSettingsKey) => {
	const info = memberSettingsInfo[k];
	info.clearable = info.type.endsWith('[]') || info.defaultValue === null;
	(memberDefaultSettings[k] as any) = memberSettingsInfo[k].defaultValue;
});

// ------------------------------------
// Invite Code Settings
// ------------------------------------
export interface InviteCodeSettingsObject {
	[InviteCodeSettingsKey.name]: string;
	[InviteCodeSettingsKey.roles]: string[];
}

export const inviteCodeSettingsInfo: {
	[k in InviteCodeSettingsKey]: SettingsInfo<InviteCodeSettingsObject[k]>;
} = {
	[InviteCodeSettingsKey.name]: {
		type: 'String',
		grouping: [SettingsGroup.invites],
		defaultValue: null
	},
	[InviteCodeSettingsKey.roles]: {
		type: 'Role[]',
		grouping: [SettingsGroup.invites],
		defaultValue: []
	}
};

export const inviteCodeDefaultSettings: InviteCodeSettingsObject = {} as any;
Object.keys(inviteCodeSettingsInfo).forEach((k: InviteCodeSettingsKey) => {
	const info = inviteCodeSettingsInfo[k];
	info.clearable = info.type.endsWith('[]') || info.defaultValue === null;
	(inviteCodeDefaultSettings[k] as any) = inviteCodeSettingsInfo[k].defaultValue;
});

// ------------------------------------
// Bot Settings
// ------------------------------------
export interface BotSettingsObject {
	[BotSettingsKey.activityStatus]: ActivityStatus;
	[BotSettingsKey.activityEnabled]: boolean;
	[BotSettingsKey.activityType]: ActivityType;
	[BotSettingsKey.activityMessage]: string;
	[BotSettingsKey.activityUrl]: string;
	[BotSettingsKey.embedDefaultColor]: string;
}

export const botSettingsInfo: {
	[k in BotSettingsKey]: SettingsInfo<BotSettingsObject[k]>;
} = {
	[BotSettingsKey.activityStatus]: {
		type: 'Enum<ActivityStatus>',
		grouping: [SettingsGroup.bot, SettingsGroup.general],
		defaultValue: ActivityStatus.online,
		possibleValues: Object.values(ActivityStatus)
	},
	[BotSettingsKey.activityEnabled]: {
		type: 'Boolean',
		grouping: [SettingsGroup.bot, SettingsGroup.general],
		defaultValue: true
	},
	[BotSettingsKey.activityType]: {
		type: 'Enum<ActivityType>',
		grouping: [SettingsGroup.bot, SettingsGroup.general],
		defaultValue: ActivityType.playing,
		possibleValues: Object.values(ActivityType)
	},
	[BotSettingsKey.activityMessage]: {
		type: 'String',
		grouping: [SettingsGroup.bot, SettingsGroup.general],
		defaultValue: null
	},
	[BotSettingsKey.activityUrl]: {
		type: 'String',
		grouping: [SettingsGroup.bot, SettingsGroup.general],
		defaultValue: null
	},
	[BotSettingsKey.embedDefaultColor]: {
		type: 'String',
		grouping: [SettingsGroup.bot, SettingsGroup.general],
		defaultValue: null
	}
};

export const botDefaultSettings: BotSettingsObject = {} as any;
Object.keys(botSettingsInfo).forEach((k: BotSettingsKey) => {
	const info = botSettingsInfo[k];
	info.clearable = info.type.endsWith('[]') || info.defaultValue === null;
	(botDefaultSettings[k] as any) = info.defaultValue;
});

// ------------------------------------
// Functions
// ------------------------------------
export function toDbValue(info: SettingsInfo<any>, value: any): any {
	if (value === 'default') {
		return _toDbValue(info.type, info.defaultValue);
	}

	return _toDbValue(info.type, value);
}
function _toDbValue(type: string, value: any): string {
	if (value === 'none' || value === 'empty' || value === 'null' || value === null) {
		return null;
	}

	if (type === 'Channel') {
		if (typeof value === 'string') {
			return value;
		} else {
			return (value as Channel).id;
		}
	} else if (type === 'Role') {
		if (typeof value === 'string') {
			return value;
		} else {
			return (value as Role).id;
		}
	} else if (type.endsWith('[]')) {
		const subType = type.substring(0, type.length - 2);
		return value && value.length > 0 ? value.map((v: any) => _toDbValue(subType, v)) : null;
	}

	return value;
}

export function beautify(type: InternalSettingsTypes, value: any) {
	if (typeof value === 'undefined' || value === null) {
		return null;
	}

	if (type.endsWith('[]')) {
		return value.map((v: any) => beautify(type.substring(0, type.length - 2) as InternalSettingsTypes, v)).join(' ');
	}

	switch (type) {
		case 'Boolean':
			return value ? 'True' : 'False';

		case 'Role':
			return `<@&${value}>`;

		case 'Channel':
			return `<#${value}>`;

		default:
			if (typeof value === 'string' && value.length > 1000) {
				return '`' + value.substr(0, 1000) + '`...';
			}
			return `\`${value}\``;
	}
}
