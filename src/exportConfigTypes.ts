import fs from 'fs';

import {
	defaultSettings,
	Lang,
	LeaderboardStyle,
	RankAssignmentStyle,
	SettingsKey,
	SettingsObject,
	settingsTypes,
	ViolationType
} from './sequelize';

enum ConfigGroup {
	Basic = 'Basic',
	JoinLeaveMessage = 'JoinLeaveMessage',
	Invites = 'Invites',
	Ranks = 'Ranks',
	Leaderboard = 'Leaderboard',
	Captcha = 'Captcha',
	Moderation = 'Moderation'
}

interface DescriptionObject {
	description: string;
	group: ConfigGroup;
	defaultValue: any;
	type: string;
	exampleValues?: string[];
	possibleValues?: string[];
	premiumInfo?: string;
	markdown?: string;
}

function getEmpty() {
	return {
		description: '',
		defaultValue: '',
		type: ''
	};
}

export const settingsDescription: { [k in SettingsKey]: DescriptionObject } = {
	prefix: {
		...getEmpty(),
		group: ConfigGroup.Basic,
		description:
			'The prefix needed to use bot commands. If you don\'t remember your prefix, you can do @InviteManager config prefix',
		exampleValues: ['+', '>']
	},
	lang: {
		...getEmpty(),
		group: ConfigGroup.Basic,
		description: 'Set the language of the bot',
		possibleValues: Object.values(Lang)
	},
	logChannel: {
		...getEmpty(),
		group: ConfigGroup.Basic,
		description: 'The channel where changes to the database are made (add-ranks, clear-invites, etc.)',
		exampleValues: ['#channel']
	},
	getUpdates: {
		...getEmpty(),
		group: ConfigGroup.Basic,
		description: 'Whether or not you want to receive updates of our bot in the log or mod channel.'
	},

	joinMessage: {
		...getEmpty(),
		group: ConfigGroup.JoinLeaveMessage,
		description: 'The message that will be posted every time a member joins your server.',
		exampleValues: ['', ''],
		premiumInfo: 'Premium users can use embeds as join messages.'
	},
	joinMessageChannel: {
		...getEmpty(),
		group: ConfigGroup.JoinLeaveMessage,
		description: 'The channel where join messages will be posted.',
		exampleValues: ['#general', '#joins']
	},
	leaveMessage: {
		...getEmpty(),
		group: ConfigGroup.JoinLeaveMessage,
		description: 'The message that will be posted every time a member leaves your server.',
		exampleValues: ['', ''],
		premiumInfo: 'Premium users can use embeds as leave messages.'
	},
	leaveMessageChannel: {
		...getEmpty(),
		group: ConfigGroup.JoinLeaveMessage,
		description: 'The channel where leave messages will be posted.',
		exampleValues: ['#general', '#leaves']
	},

	leaderboardStyle: {
		...getEmpty(),
		group: ConfigGroup.Leaderboard,
		description: 'Change the style how the leaderboard is displayed.',
		possibleValues: Object.values(LeaderboardStyle)
	},
	hideLeftMembersFromLeaderboard: {
		...getEmpty(),
		group: ConfigGroup.Leaderboard,
		description: 'Whether or not to hide people who left from the leaderboard.'
	},

	autoSubtractFakes: {
		...getEmpty(),
		group: ConfigGroup.Invites,
		description: 'Should fake invites automatically be subtracted from invites?'
	},
	autoSubtractLeaves: {
		...getEmpty(),
		group: ConfigGroup.Invites,
		description: 'Should members who leave be subtracted from their inviters?',
	},
	autoSubtractLeaveThreshold: {
		...getEmpty(),
		group: ConfigGroup.Invites,
		description: 'The time (in seconds) within leaves will be subtracted from the inviter.',
		exampleValues: ['60', '3600']
	} /* seconds */,

	rankAssignmentStyle: {
		...getEmpty(),
		group: ConfigGroup.Ranks,
		description:
			'If set to `highest`, only the highest rank will assigned to the member when reaching a new rank.'
			+ 'If set to `all`, all ranks will be assigned to the member when reaching a new rank.',
		possibleValues: Object.values(RankAssignmentStyle)
	},
	rankAnnouncementChannel: {
		...getEmpty(),
		group: ConfigGroup.Ranks,
		description: 'The channel where rank changes are announced.',
		exampleValues: ['', '']
	},
	rankAnnouncementMessage: {
		...getEmpty(),
		group: ConfigGroup.Ranks,
		description: 'The message that will be posted when a member reaches a new rank.',
		exampleValues: ['', ''],
		premiumInfo: 'Premium users can use embeds as rank announcement messages.'
	},

	mutedRole: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'The role that will be assigned if a member is muted by the bot',
		exampleValues: ['@muted']
	},

	captchaVerificationOnJoin: {
		...getEmpty(),
		group: ConfigGroup.Captcha,
		description: 'If enabled, new members have to verify they are human by entering a captcha '
			+ 'that is sent to them via DM. If they fail to enter the captcha within the specified time, '
			+ 'they will be kicked from the server.',
		premiumInfo: 'This feature is only available for premium users.'
	},
	captchaVerificationWelcomeMessage: {
		...getEmpty(),
		group: ConfigGroup.Captcha,
		description: 'The message users receive together with the captcha (via DM)',
		exampleValues: ['Welcome, please enter the captcha below!'],
		premiumInfo: 'This feature is only available for premium users.'
	},
	captchaVerificationSuccessMessage: {
		...getEmpty(),
		group: ConfigGroup.Captcha,
		description: 'The message users will get after successfully entering the captcha.',
		exampleValues: ['Thanks for entering the captcha, enjoy our server!'],
		premiumInfo: 'This feature is only available for premium users.'
	},
	captchaVerificationFailedMessage: {
		...getEmpty(),
		group: ConfigGroup.Captcha,
		description: 'The message users will get if they fail to enter the right captcha within the specified time. '
			+ 'After getting this message, they will be kicked from the server.',
		exampleValues: ['Looks like you are not human :(. You can join again and try again later if this was a mistake!'],
		premiumInfo: 'This feature is only available for premium users.'
	},
	captchaVerificationTimeout: {
		...getEmpty(),
		group: ConfigGroup.Captcha,
		description: 'The time within the member needs to enter the captcha successfully (in seconds).',
		exampleValues: ['60', '600'],
		premiumInfo: 'This feature is only available for premium users.'
	} /* seconds */,
	captchaVerificationLogEnabled: {
		...getEmpty(),
		group: ConfigGroup.Captcha,
		description: 'Whether or not new captcha entries are logged to a channel',
		premiumInfo: 'This feature is only available for premium users.'
	},

	modLogChannel: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'The channel where moderation log messages will be posted.',
		exampleValues: ['#channel', '#logs']
	},
	modPunishmentBanDeleteMessage: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Whether or not the own and bot message should be deleted when a mod does !ban.',
	},
	modPunishmentKickDeleteMessage: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Whether or not the own and bot message should be deleted when a mod does !kick.',
	},
	modPunishmentSoftbanDeleteMessage: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Whether or not the own and bot message should be deleted when a mod does !softban.',
	},
	modPunishmentWarnDeleteMessage: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Whether or not the own and bot message should be deleted when a mod does !warn.',
	},
	modPunishmentMuteDeleteMessage: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Whether or not the own and bot message should be deleted when a mod does !mute.',
	},

	autoModEnabled: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Whether or not auto-moderation is enabled globally.',
	},
	autoModModeratedChannels: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Set channels that should be auto-moderated. (Comma separated list)',
		exampleValues: ['#general', '#support,#help']
	},
	autoModModeratedRoles: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Roles that will be auto-moderated. (Comma separated list)',
		exampleValues: ['@NewMembers', '@Newbies,@Starters']
	},
	autoModIgnoredChannels: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Set channels that should not be auto-moderated. (Comma separated list)',
		exampleValues: ['#general', '#off-topic,#nsfw']
	},
	autoModIgnoredRoles: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Roles that will not be auto-moderated. (Comma separated list)',
		exampleValues: ['@TrustedMembers', '@Moderators,@Staff']
	},
	autoModDeleteBotMessage: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Whether or not to delete bot messages after auto-moderation.',
	},
	autoModDeleteBotMessageTimeoutInSeconds: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'How long (in seconds) until auto-moderation responses from the bot are deleted. '
			+ 'If set to 0, the bot will not post a message and only delete the violating message and warn the user.',
		exampleValues: ['5', '10']
	},
	autoModLogEnabled: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'If set to yes, all moderation actions will be logged to the `modLogChannel`.'
	},

	autoModDisabledForOldMembers: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'If enabled, members that have been on the server for a certain amount of time will not be '
			+ 'auto-moderated. You can set the threshold for how long that is.'
	},
	autoModDisabledForOldMembersThreshold: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'After how long (in seconds) members will no longer be auto-moderated (if enabled).',
		exampleValues: ['604800` (1 week)`', '2419200` (1 month)`']
	} /* seconds, default 1 week */,

	autoModInvitesEnabled: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'If enabled, invite links will be auto-moderated.'
	},

	autoModLinksEnabled: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'If enabled, links will be auto-moderated.'
	},
	autoModLinksWhitelist: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'A comma separated list of links that are allowed to be posted.',
		exampleValues: ['discordbots.org', 'youtube.com,twitch.com']
	},
	autoModLinksBlacklist: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'A comma separated list of links that are not allowed to be posted.',
		exampleValues: ['google.com', 'twitch.com,youtube.com']
	},
	autoModLinksFollowRedirects: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'If enabled, our bot will follow redirects to see where a link leads '
			+ '(to prevent people from using link-shorteners.)',
		premiumInfo: 'This feature is only available for premium users.'
	},

	autoModWordsEnabled: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'If enabled, certain words will be auto-moderated.'
	},
	autoModWordsBlacklist: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'A comma separated list of words that will be auto-moderated.',
		exampleValues: ['gay', 'stupid,fuck']
	},

	autoModAllCapsEnabled: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'If enabled, messages written in all/mostly CAPS will be auto-moderated.'
	},
	autoModAllCapsMinCharacters: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'How long a message needs to be until this violation is activated.',
		exampleValues: ['5', '15']
	},
	autoModAllCapsPercentageCaps: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Percentage of letters that need to be CAPS to be triggered.',
		exampleValues: ['50', '90']
	},

	autoModDuplicateTextEnabled: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'If enabled, duplicate text will be auto-moderated.'
	},
	autoModDuplicateTextTimeframeInSeconds: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Time (in seconds) within the same text of the same author will be auto-moderated.',
		exampleValues: ['5', '20']
	},

	autoModQuickMessagesEnabled: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'If enabled, message sent quickly after another will be auto-moderated.'
	},
	autoModQuickMessagesNumberOfMessages: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'How many messages within the specified amount of time will be considered spam and are auto-moderated.',
		exampleValues: ['5', '10']
	},
	autoModQuickMessagesTimeframeInSeconds: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'During what timeframe (in seconds) quick messages will be counted.',
		exampleValues: ['2', '10']
	},

	autoModMentionUsersEnabled: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'If enabled, too many user mentions will be auto-moderated.'
	},
	autoModMentionUsersMaxNumberOfMentions: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Maximum amount of user mentions per message.',
		exampleValues: ['2', '5']
	},

	autoModMentionRolesEnabled: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'If enabled, too many role mentions will be auto-moderated.'
	},
	autoModMentionRolesMaxNumberOfMentions: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Maximum amount of role mentions per message.',
		exampleValues: ['2', '5']
	},

	autoModEmojisEnabled: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'If enabled, too many emojis will be auto-moderated.'
	},
	autoModEmojisMaxNumberOfEmojis: {
		...getEmpty(),
		group: ConfigGroup.Moderation,
		description: 'Maximum amount of emojis per message.',
		exampleValues: ['5', '10']
	}
};

Object.keys(settingsDescription).forEach((key: SettingsKey) => {
	settingsDescription[key].defaultValue = defaultSettings[key];
	let type: string = settingsTypes[key];
	if (type.endsWith('[]')) {
		type = `List of ${type.substr(0, type.length - 2)}`;
	}
	settingsDescription[key].type = type;
});

Object.keys(settingsDescription).forEach((key: SettingsKey) => {
	settingsDescription[key].markdown = generateText(key, settingsDescription[key]);
});

function generateText(key: SettingsKey, obj: DescriptionObject) {
	let text = `## ${key}\n\n`;
	text += `${obj.description}\n\n`;
	text += `Type: \`${obj.type}\`\n\n`;
	text += `Default: \`${obj.defaultValue}\`\n\n`;
	text += `**Configuration**\n\n`;
	text += `Reset to default:\n\`!config ${key} default\`\n\n`;
	if (obj.type === 'Boolean') {
		text += `Enable:\n\n`;
		text += `\`!config ${key} true\`\n\n`;
		text += `Disable:\n\n`;
		text += `\`!config ${key} false\`\n\n`;
	} else {
		if (obj.possibleValues) {
			text += `Possible values: ${obj.possibleValues.map(v => `\`${v}\``).join(', ')}\n\n`;
			text += `Example:\n\n`;
			text += `\`!config ${key} ${obj.possibleValues[0]}\`\n\n`;
		}
		if (obj.exampleValues) {
			text += `Examples:\n\n`;
			obj.exampleValues.forEach(ex => {
				text += `\`!config ${key} ${ex}\`\n\n`;
			});
		}
	}
	if (obj.premiumInfo) {
		text += `{% hint style="info" %} ${obj.premiumInfo} {% endhint %}`;
	}

	return text;
}

let out = '# Configs\n\n';
out += 'There are many config options that can be set. '
	+ 'You don\'t have to set all of them. If you just added the bot, just run '
	+ '`!setup`, which will guide you through the most important ones.\n\n';
Object.keys(ConfigGroup).forEach(cg => {
	out += `# ${cg}\n`;
	out += Object.keys(settingsDescription)
		.filter((key: SettingsKey) => settingsDescription[key].group === cg)
		.map((key: SettingsKey) => `- [${key}](#${key.toLowerCase()})`)
		.join('\n');
	out += `\n\n`;
});
out += `# Detailed Config Options\n\n`;
out += Object.keys(settingsDescription).map((key: SettingsKey) => settingsDescription[key].markdown).join('\n\n');

fs.writeFileSync('./Generated.md', out);
