import { Channel, Role } from 'eris';

import {
	InviteCodeSettingsKey,
	Lang,
	LeaderboardStyle,
	MemberSettingsKey,
	RankAssignmentStyle,
	SettingsKey
} from './sequelize';

export type InternalSettingsTypes =
	| 'Boolean'
	| 'Number'
	| 'String'
	| 'String[]'
	| 'Channel'
	| 'Channel[]'
	| 'Role'
	| 'Role[]'
	| 'Enum<LeaderboardStyle>'
	| 'Enum<RankAssignmentStyle>'
	| 'Enum<Lang>';

export interface SettingsInfo {
	type: InternalSettingsTypes;
	grouping: string[];
	defaultValue: any;
	exampleValues?: string[];
	possibleValues?: string[];
	hasPremiumInfo?: boolean;
}

// ------------------------------------
// Settings
// ------------------------------------
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

export const settingsInfo: { [k in SettingsKey]: SettingsInfo } = {
	prefix: {
		type: 'String',
		grouping: ['general'],
		defaultValue: '!',
		exampleValues: ['+', '>']
	},
	lang: {
		type: 'Enum<Lang>',
		grouping: ['general'],
		defaultValue: Lang.en,
		possibleValues: Object.values(Lang)
	},
	logChannel: {
		type: 'Channel',
		grouping: ['general'],
		defaultValue: null,
		exampleValues: ['#channel']
	},
	getUpdates: {
		type: 'Boolean',
		grouping: ['general'],
		defaultValue: true
	},

	joinMessage: {
		type: 'String',
		grouping: ['invites', 'joins'],
		defaultValue:
			'{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)',
		hasPremiumInfo: true
	},
	joinMessageChannel: {
		type: 'Channel',
		grouping: ['invites', 'joins'],
		defaultValue: null,
		exampleValues: ['#general', '#joins']
	},
	leaveMessage: {
		type: 'String',
		grouping: ['invites', 'leaves'],
		defaultValue: '{memberName} **left**; Invited by **{inviterName}**',
		exampleValues: ['', ''],
		hasPremiumInfo: true
	},
	leaveMessageChannel: {
		type: 'Channel',
		grouping: ['invites', 'leaves'],
		defaultValue: null,
		exampleValues: ['#general', '#leaves']
	},

	leaderboardStyle: {
		type: 'Enum<LeaderboardStyle>',
		grouping: ['invites', 'leaderboard'],
		defaultValue: LeaderboardStyle.normal,
		possibleValues: Object.values(LeaderboardStyle)
	},
	hideLeftMembersFromLeaderboard: {
		type: 'Boolean',
		grouping: ['invites', 'leaderboard'],
		defaultValue: true
	},

	autoSubtractFakes: {
		type: 'Boolean',
		grouping: ['invites', 'fakes'],
		defaultValue: true
	},
	autoSubtractLeaves: {
		type: 'Boolean',
		grouping: ['invites', 'leaves'],
		defaultValue: true
	},

	autoSubtractLeaveThreshold: {
		type: 'Number' /* seconds */,
		grouping: ['invites', 'leaves'],
		defaultValue: 600,
		exampleValues: ['60', '3600']
	},

	rankAssignmentStyle: {
		type: 'Enum<RankAssignmentStyle>',
		grouping: ['invites', 'ranks'],
		defaultValue: RankAssignmentStyle.all,
		possibleValues: Object.values(RankAssignmentStyle)
	},
	rankAnnouncementChannel: {
		type: 'Channel',
		grouping: ['invites', 'ranks'],
		defaultValue: null,
		exampleValues: ['', '']
	},
	rankAnnouncementMessage: {
		type: 'String',
		grouping: ['invites', 'ranks'],
		defaultValue:
			'Congratulations, **{memberMention}** has reached the **{rankName}** rank!',
		exampleValues: ['', ''],
		hasPremiumInfo: true
	},

	captchaVerificationOnJoin: {
		type: 'Boolean',
		grouping: ['moderation', 'captcha'],
		defaultValue: false,
		hasPremiumInfo: true
	},
	captchaVerificationWelcomeMessage: {
		type: 'String',
		grouping: ['moderation', 'captcha'],
		defaultValue:
			'Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.',
		exampleValues: ['Welcome, please enter the captcha below!'],
		hasPremiumInfo: true
	},
	captchaVerificationSuccessMessage: {
		type: 'String',
		grouping: ['moderation', 'captcha'],
		defaultValue:
			'You have successfully entered the captcha. Welcome to the server!',
		exampleValues: ['Thanks for entering the captcha, enjoy our server!'],
		hasPremiumInfo: true
	},
	captchaVerificationFailedMessage: {
		type: 'String',
		grouping: ['moderation', 'captcha'],
		defaultValue:
			'You did not enter the captha right within the specified time.' +
			`We're sorry, but we have to kick you from the server. Feel free to join again.`,
		exampleValues: [
			'Looks like you are not human :(. You can join again and try again later if this was a mistake!'
		],
		hasPremiumInfo: true
	},
	captchaVerificationTimeout: {
		type: 'Number' /* seconds */,
		grouping: ['moderation', 'captcha'],
		defaultValue: 180,
		exampleValues: ['60', '600'],
		hasPremiumInfo: true
	},
	captchaVerificationLogEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'captcha'],
		defaultValue: true,
		hasPremiumInfo: true
	},

	autoModEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'general'],
		defaultValue: false
	},
	autoModModeratedChannels: {
		type: 'Channel[]',
		grouping: ['moderation', 'general'],
		defaultValue: [],
		exampleValues: ['#general', '#support,#help']
	},
	autoModModeratedRoles: {
		type: 'Role[]',
		grouping: ['moderation', 'general'],
		defaultValue: [],
		exampleValues: ['@NewMembers', '@Newbies,@Starters']
	},
	autoModIgnoredChannels: {
		type: 'Channel[]',
		grouping: ['moderation', 'general'],
		defaultValue: [],
		exampleValues: ['#general', '#off-topic,#nsfw']
	},
	autoModIgnoredRoles: {
		type: 'Role[]',
		grouping: ['moderation', 'general'],
		defaultValue: [],
		exampleValues: ['@TrustedMembers', '@Moderators,@Staff']
	},
	mutedRole: {
		type: 'Role',
		grouping: ['moderation', 'general'],
		defaultValue: null,
		exampleValues: ['@muted']
	},
	autoModDisabledForOldMembers: {
		type: 'Boolean',
		grouping: ['moderation', 'general'],
		defaultValue: false
	},
	autoModDisabledForOldMembersThreshold: {
		type: 'Number' /* seconds */,
		grouping: ['moderation', 'general'],
		defaultValue: 604800 /* 1 week */,
		exampleValues: ['604800` (1 week)`', '2419200` (1 month)`']
	},

	autoModLogEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'logging'],
		defaultValue: true
	},
	modLogChannel: {
		type: 'Channel',
		grouping: ['moderation', 'logging'],
		defaultValue: null,
		exampleValues: ['#channel', '#logs']
	},
	autoModDeleteBotMessage: {
		type: 'Boolean',
		grouping: ['moderation', 'logging'],
		defaultValue: true
	},
	autoModDeleteBotMessageTimeoutInSeconds: {
		type: 'Number',
		grouping: ['moderation', 'logging'],
		defaultValue: 5,
		exampleValues: ['5', '10']
	},
	modPunishmentBanDeleteMessage: {
		type: 'Boolean',
		grouping: ['moderation', 'logging'],
		defaultValue: true
	},
	modPunishmentKickDeleteMessage: {
		type: 'Boolean',
		grouping: ['moderation', 'logging'],
		defaultValue: true
	},
	modPunishmentSoftbanDeleteMessage: {
		type: 'Boolean',
		grouping: ['moderation', 'logging'],
		defaultValue: true
	},
	modPunishmentWarnDeleteMessage: {
		type: 'Boolean',
		grouping: ['moderation', 'logging'],
		defaultValue: true
	},
	modPunishmentMuteDeleteMessage: {
		type: 'Boolean',
		grouping: ['moderation', 'logging'],
		defaultValue: true
	},

	autoModInvitesEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'invites'],
		defaultValue: true
	},

	autoModLinksEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'links'],
		defaultValue: true
	},
	autoModLinksWhitelist: {
		type: 'String[]',
		grouping: ['moderation', 'links'],
		defaultValue: [],
		exampleValues: ['discordbots.org', 'youtube.com,twitch.com']
	},
	autoModLinksBlacklist: {
		type: 'String[]',
		grouping: ['moderation', 'links'],
		defaultValue: [],
		exampleValues: ['google.com', 'twitch.com,youtube.com']
	},
	autoModLinksFollowRedirects: {
		type: 'Boolean',
		grouping: ['moderation', 'links'],
		defaultValue: true,
		hasPremiumInfo: true
	},

	autoModWordsEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'bannedWords'],
		defaultValue: true
	},
	autoModWordsBlacklist: {
		type: 'String[]',
		grouping: ['moderation', 'bannedWords'],
		defaultValue: [],
		exampleValues: ['gay', 'stupid,fuck']
	},

	autoModAllCapsEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'caps'],
		defaultValue: true
	},
	autoModAllCapsMinCharacters: {
		type: 'Number',
		grouping: ['moderation', 'caps'],
		defaultValue: 10,
		exampleValues: ['5', '15']
	},
	autoModAllCapsPercentageCaps: {
		type: 'Number',
		grouping: ['moderation', 'caps'],
		defaultValue: 70,
		exampleValues: ['50', '90']
	},

	autoModDuplicateTextEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'duplicate'],
		defaultValue: true
	},
	autoModDuplicateTextTimeframeInSeconds: {
		type: 'Number',
		grouping: ['moderation', 'duplicate'],
		defaultValue: 30,
		exampleValues: ['5', '20']
	},

	autoModQuickMessagesEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'spam'],
		defaultValue: true
	},
	autoModQuickMessagesNumberOfMessages: {
		type: 'Number',
		grouping: ['moderation', 'spam'],
		defaultValue: 5,
		exampleValues: ['5', '10']
	},
	autoModQuickMessagesTimeframeInSeconds: {
		type: 'Number',
		grouping: ['moderation', 'spam'],
		defaultValue: 3,
		exampleValues: ['2', '10']
	},

	autoModMentionUsersEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'mentions'],
		defaultValue: true
	},
	autoModMentionUsersMaxNumberOfMentions: {
		type: 'Number',
		grouping: ['moderation', 'mentions'],
		defaultValue: 5,
		exampleValues: ['2', '5']
	},
	autoModMentionRolesEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'mentions'],
		defaultValue: true
	},
	autoModMentionRolesMaxNumberOfMentions: {
		type: 'Number',
		grouping: ['moderation', 'mentions'],
		defaultValue: 3,
		exampleValues: ['2', '5']
	},

	autoModEmojisEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'emojis'],
		defaultValue: true
	},
	autoModEmojisMaxNumberOfEmojis: {
		type: 'Number',
		grouping: ['moderation', 'emojis'],
		defaultValue: 5,
		exampleValues: ['5', '10']
	},

	autoModHoistEnabled: {
		type: 'Boolean',
		grouping: ['moderation', 'emojis'],
		defaultValue: true
	}
};

export const defaultSettings: SettingsObject = {} as any;
Object.keys(settingsInfo).forEach(
	(k: SettingsKey) => (defaultSettings[k] = settingsInfo[k].defaultValue)
);

// ------------------------------------
// Member Settings
// ------------------------------------
export type MemberSettingsObject = {
	hideFromLeaderboard: boolean;
};

export const memberSettingsInfo: { [k in MemberSettingsKey]: SettingsInfo } = {
	hideFromLeaderboard: {
		type: 'Boolean',
		grouping: ['invites'],
		defaultValue: false
	}
};

export const memberDefaultSettings: MemberSettingsObject = {} as any;
Object.keys(memberSettingsInfo).forEach(
	(k: MemberSettingsKey) =>
		(memberDefaultSettings[k] = memberSettingsInfo[k].defaultValue)
);

// ------------------------------------
// Invite Code Settings
// ------------------------------------
export type InviteCodeSettingsObject = {
	name: string;
	roles: string[];
};

export const inviteCodeSettingsInfo: {
	[k in InviteCodeSettingsKey]: SettingsInfo
} = {
	name: {
		type: 'String',
		grouping: ['invites'],
		defaultValue: null
	},
	roles: {
		type: 'Role[]',
		grouping: ['invites'],
		defaultValue: []
	}
};

export const inviteCodeDefaultSettings: InviteCodeSettingsObject = {} as any;
Object.keys(inviteCodeSettingsInfo).forEach(
	(k: InviteCodeSettingsKey) =>
		(inviteCodeDefaultSettings[k] = inviteCodeSettingsInfo[k].defaultValue)
);

// ------------------------------------
// Functions
// ------------------------------------
type AllKeys = SettingsKey | MemberSettingsKey | InviteCodeSettingsKey;
export const allSettingsInfo = {
	...settingsInfo,
	...memberSettingsInfo,
	...inviteCodeSettingsInfo
};

export function canClear<K extends AllKeys>(key: K) {
	const info = allSettingsInfo[key];
	return info.type.endsWith('[]') || info.defaultValue === null;
}

export function toDbValue<K extends AllKeys>(key: K, value: any): string {
	const info = allSettingsInfo[key];

	if (value === 'default') {
		return _toDbValue(info.type, info.defaultValue);
	}

	return _toDbValue(info.type, value);
}
function _toDbValue(type: string, value: any): string {
	if (
		value === 'none' ||
		value === 'empty' ||
		value === 'null' ||
		value === null
	) {
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
	} else if (type === 'Boolean') {
		return value ? 'true' : 'false';
	} else if (type.endsWith('[]')) {
		const subType = type.substring(0, type.length - 2);
		return value && value.length > 0
			? value.map((v: any) => _toDbValue(subType, v)).join(',')
			: null;
	}

	return value;
}

export function fromDbValue<K extends AllKeys>(key: K, value: string): any {
	const info = allSettingsInfo[key];
	return _fromDbValue(info.type, value);
}
function _fromDbValue(type: string, value: string): any {
	// Handle lists first because we don't want to return null for those
	if (type.endsWith('[]')) {
		const subType = type.substring(0, type.length - 2);
		return value && value.length > 0
			? value.split(',').map(s => _fromDbValue(subType, s))
			: [];
	}

	if (value === undefined || value === null) {
		return null;
	}

	if (type === 'Boolean') {
		return value === 'true';
	} else if (type === 'Number') {
		return parseInt(value, 10);
	}

	return value;
}

export function beautify<K extends AllKeys>(key: K, value: any) {
	if (typeof value === 'undefined' || value === null) {
		return null;
	}

	const info = allSettingsInfo[key];
	switch (info.type) {
		case 'Boolean':
			return value ? 'True' : 'False';

		case 'Role':
			return `<@&${value}>`;

		case 'Role[]':
			return value.map((v: any) => `<@&${v}>`).join(' ');

		case 'Channel':
			return `<#${value}>`;

		case 'Channel[]':
			return value.map((v: any) => `<#${v}>`).join(' ');

		case 'String[]':
			return value.map((v: any) => '`' + v + '`').join(', ');

		default:
			if (typeof value === 'string' && value.length > 1000) {
				return value.substr(0, 1000) + '...';
			}
			return value;
	}
}
