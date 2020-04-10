import { TextChannel } from 'eris';

import { Setting, Settings } from '../../framework/decorators/Setting';
import { Guild } from '../../framework/models/Guild';
import { GuildPermission } from '../../types';

const BASE_GROUP = 'moderation';
enum Group {
	general = 'general',
	captcha = 'captcha',
	logging = 'logging',
	invites = 'invites',
	links = 'links',
	caps = 'caps',
	bannedWords = 'bannedWords',
	duplicate = 'duplicate',
	spam = 'spam',
	mentions = 'mentions',
	emojis = 'emojis'
}

@Settings(Guild)
export class ModerationGuildSettings {
	@Setting({
		type: 'Role',
		grouping: [BASE_GROUP, Group.general],
		defaultValue: null,
		exampleValues: ['@muted']
	})
	public mutedRole: string;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.captcha],
		defaultValue: false,
		hasPremiumInfo: true
	})
	public captchaVerificationOnJoin: boolean;
	@Setting({
		type: 'String',
		grouping: [BASE_GROUP, Group.captcha],
		defaultValue:
			'Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.',
		exampleValues: ['Welcome, please enter the captcha below!'],
		hasPremiumInfo: true
	})
	public captchaVerificationWelcomeMessage: string;
	@Setting({
		type: 'String',
		grouping: [BASE_GROUP, Group.captcha],
		defaultValue: 'You have successfully entered the captcha. Welcome to the server!',
		exampleValues: ['Thanks for entering the captcha, enjoy our server!'],
		hasPremiumInfo: true
	})
	public captchaVerificationSuccessMessage: string;
	@Setting({
		type: 'String',
		grouping: [BASE_GROUP, Group.captcha],
		defaultValue:
			'You did not enter the captha right within the specified time.' +
			`We're sorry, but we have to kick you from the server. Feel free to join again.`,
		exampleValues: ['Looks like you are not human :(. You can join again and try again later if this was a mistake!'],
		hasPremiumInfo: true
	})
	public captchaVerificationFailedMessage: string;
	@Setting({
		type: 'Number' /* seconds */,
		grouping: [BASE_GROUP, Group.captcha],
		defaultValue: 180,
		exampleValues: ['60', '600'],
		hasPremiumInfo: true
	})
	public captchaVerificationTimeout: number /* seconds */;
	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.captcha],
		defaultValue: true,
		hasPremiumInfo: true
	})
	public captchaVerificationLogEnabled: boolean;

	@Setting({
		type: 'Channel',
		grouping: [BASE_GROUP, Group.logging],
		defaultValue: null,
		exampleValues: ['#channel', '#logs'],
		validate: (_, value: TextChannel, { t, me }) => {
			const channel = value;

			if (!(channel instanceof TextChannel)) {
				return t('settings.modLogChannel.mustBeTextChannel');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.READ_MESSAGES)) {
				return t('settings.modLogChannel.canNotReadMessages');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.SEND_MESSAGES)) {
				return t('settings.modLogChannel.canNotSendMessages');
			}
			if (!channel.permissionsOf(me.id).has(GuildPermission.EMBED_LINKS)) {
				return t('settings.modLogChannel.canNotSendEmbeds');
			}

			return null;
		}
	})
	public modLogChannel: string;
	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.logging],
		defaultValue: true
	})
	public modPunishmentBanDeleteMessage: boolean;
	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.logging],
		defaultValue: true
	})
	public modPunishmentKickDeleteMessage: boolean;
	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.logging],
		defaultValue: true
	})
	public modPunishmentSoftbanDeleteMessage: boolean;
	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.logging],
		defaultValue: true
	})
	public modPunishmentWarnDeleteMessage: boolean;
	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.logging],
		defaultValue: true
	})
	public modPunishmentMuteDeleteMessage: boolean;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.general],
		defaultValue: false
	})
	public autoModEnabled: boolean;
	@Setting({
		type: 'Channel[]',
		grouping: [BASE_GROUP, Group.general],
		defaultValue: [],
		exampleValues: ['#general', '#support,#help']
	})
	public autoModModeratedChannels: string[];
	@Setting({
		type: 'Role[]',
		grouping: [BASE_GROUP, Group.general],
		defaultValue: [],
		exampleValues: ['@NewMembers', '@Newbies,@Starters']
	})
	public autoModModeratedRoles: string[];
	@Setting({
		type: 'Channel[]',
		grouping: [BASE_GROUP, Group.general],
		defaultValue: [],
		exampleValues: ['#general', '#off-topic,#nsfw']
	})
	public autoModIgnoredChannels: string[];
	@Setting({
		type: 'Role[]',
		grouping: [BASE_GROUP, Group.general],
		defaultValue: [],
		exampleValues: ['@TrustedMembers', '@Moderators,@Staff']
	})
	public autoModIgnoredRoles: string[];

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.logging],
		defaultValue: true
	})
	public autoModLogEnabled: boolean;
	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.logging],
		defaultValue: true
	})
	public autoModDeleteBotMessage: boolean;
	@Setting({
		type: 'Number',
		grouping: [BASE_GROUP, Group.logging],
		defaultValue: 5,
		exampleValues: ['5', '10']
	})
	public autoModDeleteBotMessageTimeoutInSeconds: number;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.general],
		defaultValue: false
	})
	public autoModDisabledForOldMembers: boolean;
	@Setting({
		type: 'Number' /* seconds */,
		grouping: [BASE_GROUP, Group.general],
		defaultValue: 604800 /* 1 week */,
		exampleValues: ['604800` (1 week)`', '2419200` (1 month)`']
	})
	public autoModDisabledForOldMembersThreshold: number /* seconds, default 1 week */;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.invites],
		defaultValue: true
	})
	public autoModInvitesEnabled: boolean;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.links],
		defaultValue: true
	})
	public autoModLinksEnabled: boolean;
	@Setting({
		type: 'String[]',
		grouping: [BASE_GROUP, Group.links],
		defaultValue: [],
		exampleValues: ['discordbots.org', 'youtube.com,twitch.com']
	})
	public autoModLinksWhitelist: string[];
	@Setting({
		type: 'String[]',
		grouping: [BASE_GROUP, Group.links],
		defaultValue: [],
		exampleValues: ['google.com', 'twitch.com,youtube.com']
	})
	public autoModLinksBlacklist: string[];
	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.links],
		defaultValue: true,
		hasPremiumInfo: true
	})
	public autoModLinksFollowRedirects: boolean;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.bannedWords],
		defaultValue: true
	})
	public autoModWordsEnabled: boolean;
	@Setting({
		type: 'String[]',
		grouping: [BASE_GROUP, Group.bannedWords],
		defaultValue: [],
		exampleValues: ['gay', 'stupid,fuck']
	})
	public autoModWordsBlacklist: string[];

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.caps],
		defaultValue: true
	})
	public autoModAllCapsEnabled: boolean;
	@Setting({
		type: 'Number',
		grouping: [BASE_GROUP, Group.caps],
		defaultValue: 10,
		exampleValues: ['5', '15']
	})
	public autoModAllCapsMinCharacters: number;
	@Setting({
		type: 'Number',
		grouping: [BASE_GROUP, Group.caps],
		defaultValue: 70,
		exampleValues: ['50', '90']
	})
	public autoModAllCapsPercentageCaps: number;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.duplicate],
		defaultValue: true
	})
	public autoModDuplicateTextEnabled: boolean;
	@Setting({
		type: 'Number',
		grouping: [BASE_GROUP, Group.duplicate],
		defaultValue: 60,
		exampleValues: ['5', '20']
	})
	public autoModDuplicateTextTimeframeInSeconds: number;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.spam],
		defaultValue: true
	})
	public autoModQuickMessagesEnabled: boolean;
	@Setting({
		type: 'Number',
		grouping: [BASE_GROUP, Group.spam],
		defaultValue: 5,
		exampleValues: ['5', '10']
	})
	public autoModQuickMessagesNumberOfMessages: number;
	@Setting({
		type: 'Number',
		grouping: [BASE_GROUP, Group.spam],
		defaultValue: 3,
		exampleValues: ['2', '10']
	})
	public autoModQuickMessagesTimeframeInSeconds: number;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.mentions],
		defaultValue: true
	})
	public autoModMentionUsersEnabled: boolean;
	@Setting({
		type: 'Number',
		grouping: [BASE_GROUP, Group.mentions],
		defaultValue: 5,
		exampleValues: ['2', '5']
	})
	public autoModMentionUsersMaxNumberOfMentions: number;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.mentions],
		defaultValue: true
	})
	public autoModMentionRolesEnabled: boolean;
	@Setting({
		type: 'Number',
		grouping: [BASE_GROUP, Group.mentions],
		defaultValue: 3,
		exampleValues: ['2', '5']
	})
	public autoModMentionRolesMaxNumberOfMentions: number;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.emojis],
		defaultValue: true
	})
	public autoModEmojisEnabled: boolean;
	@Setting({
		type: 'Number',
		grouping: [BASE_GROUP, Group.emojis],
		defaultValue: 5,
		exampleValues: ['5', '10']
	})
	public autoModEmojisMaxNumberOfEmojis: number;

	@Setting({
		type: 'Boolean',
		grouping: [BASE_GROUP, Group.emojis],
		defaultValue: true
	})
	public autoModHoistEnabled: boolean;
}
