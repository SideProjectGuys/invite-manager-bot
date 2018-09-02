import fs from 'fs';

import { settingsDescription } from './exportConfigTypes';
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

interface DescriptionObject {
	description: string;
	relatedConfigs?: SettingsKey[];
	markdown?: string;
}

function getEmpty() {
	return {
		description: '',
		markdown: ''
	};
}

const violationDescription: { [k in ViolationType]: DescriptionObject } = {
	invites: {
		...getEmpty(),
		description: 'This violation is triggered whenever the user posts an invite link to another discord server.',
		relatedConfigs: [SettingsKey.autoModInvitesEnabled]
	},
	links: {
		...getEmpty(),
		description: 'This violation is triggered whenever the user posts a link.',
		relatedConfigs: [
			SettingsKey.autoModLinksEnabled,
			SettingsKey.autoModLinksWhitelist,
			SettingsKey.autoModLinksBlacklist,
			SettingsKey.autoModLinksFollowRedirects,
		]
	},
	words: {
		...getEmpty(),
		description: 'This violation is triggered whenever the user posts blacklisted words.',
		relatedConfigs: [
			SettingsKey.autoModWordsEnabled,
			SettingsKey.autoModWordsBlacklist
		]
	},
	allCaps: {
		...getEmpty(),
		description: 'This violation is triggered whenever the user posts a message that is mostly in CAPS.',
		relatedConfigs: [
			SettingsKey.autoModAllCapsEnabled,
			SettingsKey.autoModAllCapsMinCharacters,
			SettingsKey.autoModAllCapsPercentageCaps
		]
	},
	duplicateText: {
		...getEmpty(),
		description: 'This violation is triggered whenever the user posts the same text multiple times.',
		relatedConfigs: [
			SettingsKey.autoModDuplicateTextEnabled,
			SettingsKey.autoModDuplicateTextTimeframeInSeconds
		]
	},
	quickMessages: {
		...getEmpty(),
		description: 'This violation is triggered whenever the user quickly posts messages.',
		relatedConfigs: [
			SettingsKey.autoModQuickMessagesEnabled,
			SettingsKey.autoModQuickMessagesNumberOfMessages,
			SettingsKey.autoModQuickMessagesTimeframeInSeconds
		]
	},
	mentionUsers: {
		...getEmpty(),
		description: 'This violation is triggered whenever the user mentions mutliple users.',
		relatedConfigs: [
			SettingsKey.autoModMentionUsersEnabled,
			SettingsKey.autoModMentionUsersMaxNumberOfMentions
		]
	},
	mentionRoles: {
		...getEmpty(),
		description: 'This violation is triggered whenever the user mentions mutliple roles.',
		relatedConfigs: [
			SettingsKey.autoModMentionRolesEnabled,
			SettingsKey.autoModMentionRolesMaxNumberOfMentions
		]
	},
	emojis: {
		...getEmpty(),
		description: 'This violation is triggered whenever the user posts multiple emojis.',
		relatedConfigs: [
			SettingsKey.autoModEmojisEnabled,
			SettingsKey.autoModEmojisMaxNumberOfEmojis
		]
	},
};

Object.keys(violationDescription).forEach((key: ViolationType) => {
	let violation = violationDescription[key];
	let markdown = `## ${key}\n\n`;
	markdown += `${violation.description}\n\n`;
	markdown += `Example:\n\n`;
	markdown += `\`\`\``;
	markdown += `!strikeconfig ${key} 1`;
	markdown += `\`\`\`\n\n`;
	markdown += 'To delete the strike config:\n\n';
	markdown += `\`\`\``;
	markdown += `!strikeconfig ${key} 0`;
	markdown += `\`\`\`\n\n`;
	markdown += `**Config options:**\n\n`;
	violation.relatedConfigs.forEach(conf => {
		markdown += `- [${conf}](https://docs.invitemanager.co/bot/other/configs#${conf.toLowerCase()})\n`;
	});
	violation.markdown = markdown;
});

let out = '';
out += Object.keys(violationDescription).map((key: ViolationType) => violationDescription[key].markdown).join('\n\n');

fs.writeFileSync('./Generated1.md', out);
