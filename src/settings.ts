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

enum ConfigGroup {
	General = 'General',
	Invites = 'Invites',
	Moderation = 'Moderation'
}

export interface SettingsInfo {
	type: InternalSettingsTypes;
	group: ConfigGroup;
	defaultValue: any;
	exampleValues?: string[];
	possibleValues?: string[];
	hasPremiumInfo?: boolean;
	markdown?: string;
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
		group: ConfigGroup.General,
		defaultValue: '!',
		exampleValues: ['+', '>']
	},
	lang: {
		type: 'Enum<Lang>',
		group: ConfigGroup.General,
		defaultValue: Lang.en,
		possibleValues: Object.values(Lang)
	},
	logChannel: {
		type: 'Channel',
		group: ConfigGroup.General,
		defaultValue: null,
		exampleValues: ['#channel']
	},
	getUpdates: {
		type: 'Boolean',
		group: ConfigGroup.General,
		defaultValue: true
	},

	joinMessage: {
		type: 'String',
		group: ConfigGroup.Invites,
		defaultValue:
			'{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)',
		hasPremiumInfo: true
	},
	joinMessageChannel: {
		type: 'Channel',
		group: ConfigGroup.Invites,
		defaultValue: null,
		exampleValues: ['#general', '#joins']
	},
	leaveMessage: {
		type: 'String',
		group: ConfigGroup.Invites,
		defaultValue: '{memberName} **left**; Invited by **{inviterName}**',
		exampleValues: ['', ''],
		hasPremiumInfo: true
	},
	leaveMessageChannel: {
		type: 'Channel',
		group: ConfigGroup.Invites,
		defaultValue: null,
		exampleValues: ['#general', '#leaves']
	},

	leaderboardStyle: {
		type: 'Enum<LeaderboardStyle>',
		group: ConfigGroup.Invites,
		defaultValue: LeaderboardStyle.normal,
		possibleValues: Object.values(LeaderboardStyle)
	},
	hideLeftMembersFromLeaderboard: {
		type: 'Boolean',
		group: ConfigGroup.Invites,
		defaultValue: true
	},

	autoSubtractFakes: {
		type: 'Boolean',
		group: ConfigGroup.Invites,
		defaultValue: true
	},
	autoSubtractLeaves: {
		type: 'Boolean',
		group: ConfigGroup.Invites,
		defaultValue: true
	},
	autoSubtractLeaveThreshold: {
		type: 'Number' /* seconds */,
		group: ConfigGroup.Invites,
		defaultValue: 600,
		exampleValues: ['60', '3600']
	},

	rankAssignmentStyle: {
		type: 'Enum<RankAssignmentStyle>',
		group: ConfigGroup.Invites,
		defaultValue: RankAssignmentStyle.all,
		possibleValues: Object.values(RankAssignmentStyle)
	},
	rankAnnouncementChannel: {
		type: 'Channel',
		group: ConfigGroup.Invites,
		defaultValue: null,
		exampleValues: ['', '']
	},
	rankAnnouncementMessage: {
		type: 'String',
		group: ConfigGroup.Invites,
		defaultValue:
			'Congratulations, **{memberMention}** has reached the **{rankName}** rank!',
		exampleValues: ['', ''],
		hasPremiumInfo: true
	},

	mutedRole: {
		type: 'Role',
		group: ConfigGroup.Moderation,
		defaultValue: null,
		exampleValues: ['@muted']
	},

	captchaVerificationOnJoin: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: false,
		hasPremiumInfo: true
	},
	captchaVerificationWelcomeMessage: {
		type: 'String',
		group: ConfigGroup.Moderation,
		defaultValue:
			'Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.',
		exampleValues: ['Welcome, please enter the captcha below!'],
		hasPremiumInfo: true
	},
	captchaVerificationSuccessMessage: {
		type: 'String',
		group: ConfigGroup.Moderation,
		defaultValue:
			'You have successfully entered the captcha. Welcome to the server!',
		exampleValues: ['Thanks for entering the captcha, enjoy our server!'],
		hasPremiumInfo: true
	},
	captchaVerificationFailedMessage: {
		type: 'String',
		group: ConfigGroup.Moderation,
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
		group: ConfigGroup.Moderation,
		defaultValue: 180,
		exampleValues: ['60', '600'],
		hasPremiumInfo: true
	},
	captchaVerificationLogEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true,
		hasPremiumInfo: true
	},

	modLogChannel: {
		type: 'Channel',
		group: ConfigGroup.Moderation,
		defaultValue: null,
		exampleValues: ['#channel', '#logs']
	},
	modPunishmentBanDeleteMessage: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	modPunishmentKickDeleteMessage: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	modPunishmentSoftbanDeleteMessage: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	modPunishmentWarnDeleteMessage: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	modPunishmentMuteDeleteMessage: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},

	autoModEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: false
	},
	autoModModeratedChannels: {
		type: 'Channel[]',
		group: ConfigGroup.Moderation,
		defaultValue: [],
		exampleValues: ['#general', '#support,#help']
	},
	autoModModeratedRoles: {
		type: 'Role[]',
		group: ConfigGroup.Moderation,
		defaultValue: [],
		exampleValues: ['@NewMembers', '@Newbies,@Starters']
	},
	autoModIgnoredChannels: {
		type: 'Channel[]',
		group: ConfigGroup.Moderation,
		defaultValue: [],
		exampleValues: ['#general', '#off-topic,#nsfw']
	},
	autoModIgnoredRoles: {
		type: 'Role[]',
		group: ConfigGroup.Moderation,
		defaultValue: [],
		exampleValues: ['@TrustedMembers', '@Moderators,@Staff']
	},
	autoModDeleteBotMessage: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	autoModDeleteBotMessageTimeoutInSeconds: {
		type: 'Number',
		group: ConfigGroup.Moderation,
		defaultValue: 5,
		exampleValues: ['5', '10']
	},
	autoModLogEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},

	autoModDisabledForOldMembers: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: false
	},
	autoModDisabledForOldMembersThreshold: {
		type: 'Number' /* seconds */,
		group: ConfigGroup.Moderation,
		defaultValue: 604800 /* 1 week */,
		exampleValues: ['604800` (1 week)`', '2419200` (1 month)`']
	},

	autoModInvitesEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},

	autoModLinksEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	autoModLinksWhitelist: {
		type: 'String[]',
		group: ConfigGroup.Moderation,
		defaultValue: [],
		exampleValues: ['discordbots.org', 'youtube.com,twitch.com']
	},
	autoModLinksBlacklist: {
		type: 'String[]',
		group: ConfigGroup.Moderation,
		defaultValue: [],
		exampleValues: ['google.com', 'twitch.com,youtube.com']
	},
	autoModLinksFollowRedirects: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true,
		hasPremiumInfo: true
	},

	autoModWordsEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	autoModWordsBlacklist: {
		type: 'String[]',
		group: ConfigGroup.Moderation,
		defaultValue: [],
		exampleValues: ['gay', 'stupid,fuck']
	},

	autoModAllCapsEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	autoModAllCapsMinCharacters: {
		type: 'Number',
		group: ConfigGroup.Moderation,
		defaultValue: 10,
		exampleValues: ['5', '15']
	},
	autoModAllCapsPercentageCaps: {
		type: 'Number',
		group: ConfigGroup.Moderation,
		defaultValue: 70,
		exampleValues: ['50', '90']
	},

	autoModDuplicateTextEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	autoModDuplicateTextTimeframeInSeconds: {
		type: 'Number',
		group: ConfigGroup.Moderation,
		defaultValue: 60,
		exampleValues: ['5', '20']
	},

	autoModQuickMessagesEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	autoModQuickMessagesNumberOfMessages: {
		type: 'Number',
		group: ConfigGroup.Moderation,
		defaultValue: 5,
		exampleValues: ['5', '10']
	},
	autoModQuickMessagesTimeframeInSeconds: {
		type: 'Number',
		group: ConfigGroup.Moderation,
		defaultValue: 3,
		exampleValues: ['2', '10']
	},

	autoModMentionUsersEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	autoModMentionUsersMaxNumberOfMentions: {
		type: 'Number',
		group: ConfigGroup.Moderation,
		defaultValue: 5,
		exampleValues: ['2', '5']
	},

	autoModMentionRolesEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	autoModMentionRolesMaxNumberOfMentions: {
		type: 'Number',
		group: ConfigGroup.Moderation,
		defaultValue: 3,
		exampleValues: ['2', '5']
	},

	autoModEmojisEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
		defaultValue: true
	},
	autoModEmojisMaxNumberOfEmojis: {
		type: 'Number',
		group: ConfigGroup.Moderation,
		defaultValue: 5,
		exampleValues: ['5', '10']
	},

	autoModHoistEnabled: {
		type: 'Boolean',
		group: ConfigGroup.Moderation,
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
		group: ConfigGroup.Invites,
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
		group: ConfigGroup.Invites,
		defaultValue: null
	},
	roles: {
		type: 'Role[]',
		group: ConfigGroup.Invites,
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
