import { TemplateData } from '@yamdbf/core/bin/types/TemplateData';

export interface TranslationKeys {
	// Main
	BOT_SUPPORT_DISCORD_TITLE: (data: TemplateData) => string;
	BOT_INVITE_TITLE: (data: TemplateData) => string;
	BOT_WEBSITE_TITLE: (data: TemplateData) => string;
	BOT_PATREON_TITLE: (data: TemplateData) => string;

	CUSTOM_INVITES_REASON_CLEAR_REGULAR: (data: TemplateData) => string;
	CUSTOM_INVITES_REASON_CLEAR_CUSTOM: (data: TemplateData) => string;
	CUSTOM_INVITES_REASON_CLEAR_FAKE: (data: TemplateData) => string;
	CUSTOM_INVITES_REASON_CLEAR_LEAVE: (data: TemplateData) => string;
	CUSTOM_INVITES_REASON_FAKE: (data: TemplateData) => string;
	CUSTOM_INVITES_REASON_LEAVE: (data: TemplateData) => string;
	CUSTOM_INVITES_REASON_UNKNOWN: (data: TemplateData) => string;

	TEMPLATE_UNKNOWN: (data: TemplateData) => string;

	JOIN_INVITED_BY_UNKNOWN: (data: TemplateData) => string;
	LEAVE_INVITED_BY_UNKNOWN: (data: TemplateData) => string;

	JOIN_LEAVE_EMBEDS_IS_PREMIUM: (data: TemplateData) => string;

	ROLES_SHOULD_HAVE: (data: TemplateData) => string;
	ROLES_SHOULD_NOT_HAVE: (data: TemplateData) => string;

	// Commands
	CMD_ADDINVITES_ZERO: (data: TemplateData) => string;
	CMD_ADDINVITES_AMOUNT_POS: (data: TemplateData) => string;
	CMD_ADDINVITES_AMOUNT_NEG: (data: TemplateData) => string;

	CMD_ADDRANK_ROLE_TOO_HIGH: (data: TemplateData) => string;
	CMD_ADDRANK_UPDATED: (data: TemplateData) => string;
	CMD_ADDRANK_CREATED: (data: TemplateData) => string;

	CMD_BOTINFO_VERSION: (data: TemplateData) => string;
	CMD_BOTINFO_UPTIME: (data: TemplateData) => string;
	CMD_BOTINFO_GUILDS: (data: TemplateData) => string;
	CMD_BOTINFO_MEMBERS: (data: TemplateData) => string;
	CMD_BOTINFO_SHARD_CURRENT: (data: TemplateData) => string;
	CMD_BOTINFO_SHARD_TOTAL: (data: TemplateData) => string;

	CMD_CLEARINVITES_DONE: (data: TemplateData) => string;

	CMD_CONFIG_TITLE: (data: TemplateData) => string;
	CMD_CONFIG_TEXT: (data: TemplateData) => string;
	CMD_CONFIG_KEY_NOT_FOUND: (data: TemplateData) => string;
	CMD_CONFIG_KEY_CANT_CLEAR: (data: TemplateData) => string;
	CMD_CONFIG_NOT_SET: (data: TemplateData) => string;
	CMD_CONFIG_CURRENT_TITLE: (data: TemplateData) => string;
	CMD_CONFIG_CURRENT_SET_TEXT: (data: TemplateData) => string;
	CMD_CONFIG_CURRENT_NOT_SET_TEXT: (data: TemplateData) => string;
	CMD_CONFIG_ALREADY_SET_SAME_VALUE: (data: TemplateData) => string;
	CMD_CONFIG_CHANGED_TEXT: (data: TemplateData) => string;
	CMD_CONFIG_PREVIOUS_TITLE: (data: TemplateData) => string;
	CMD_CONFIG_NEW_TITLE: (data: TemplateData) => string;
	CMD_CONFIG_PREVIEW_TITLE: (data: TemplateData) => string;
	CMD_CONFIG_PREVIEW_NEXT_MESSAGE: (data: TemplateData) => string;
	CMD_CONFIG_NONE: (data: TemplateData) => string;
	CMD_CONFIG_CHANNEL_CANT_VIEW: (data: TemplateData) => string;
	CMD_CONFIG_CHANNEL_CANT_READ: (data: TemplateData) => string;
	CMD_CONFIG_CHANNEL_CANT_SEND: (data: TemplateData) => string;
	CMD_CONFIG_CHANNEL_CANT_EMBED: (data: TemplateData) => string;
	CMD_CONFIG_INVALID_LANG: (data: TemplateData) => string;
	CMD_CONFIG_INVALID_LEADERBOARD_STYLE: (data: TemplateData) => string;
	CMD_CONFIG_INVALID_RANKASSIGNMENT_STYLE: (data: TemplateData) => string;

	CMD_FAKE_TITLE: (data: TemplateData) => string;
	CMD_FAKE_NONE: (data: TemplateData) => string;
	CMD_FAKE_NONE_SINCE_JOIN: (data: TemplateData) => string;
	CMD_FAKE_JOIN_ENTRY: (data: TemplateData) => string;
	CMD_FAKE_JOIN_ENTRY_INV: (data: TemplateData) => string;

	CMD_FAQ_MORE_TITLE: (data: TemplateData) => string;
	CMD_FAQ_MORE_TEXT: (data: TemplateData) => string;
	CMD_FAQ_NOT_FOUND: (data: TemplateData) => string;

	CMD_FEEDBACK_TEXT: (data: TemplateData) => string;
	CMD_FEEDBACK_LINKS: (data: TemplateData) => string;

	CMD_HELP_TEXT: (data: TemplateData) => string;
	CMD_HELP_LINKS: (data: TemplateData) => string;
	CMD_HELP_COMMAND_TITLE: (data: TemplateData) => string;
	CMD_HELP_DESCRIPTION_TITLE: (data: TemplateData) => string;
	CMD_HELP_USAGE_TITLE: (data: TemplateData) => string;
	CMD_HELP_ALIASES_TITLE: (data: TemplateData) => string;
	CMD_HELP_BOT_PERMISSIONS_TITLE: (data: TemplateData) => string;
	CMD_HELP_USER_PERMISSIONS_TITLE: (data: TemplateData) => string;
	CMD_HELP_COMMAND_NONE: (data: TemplateData) => string;
	CMD_HELP_UNAVAILABLE_COMMAND_TITLE: (data: TemplateData) => string;
	CMD_HELP_UNAVAILABLE_COMMAND: (data: TemplateData) => string;

	CMD_INFO_NOT_IN_GUILD: (data: TemplateData) => string;
	CMD_INFO_LASTJOINED_TITLE: (data: TemplateData) => string;
	CMD_INFO_INVITES_TITLE: (data: TemplateData) => string;
	CMD_INFO_INVITES_TEXT: (data: TemplateData) => string;
	CMD_INFO_JOINED_TITLE: (data: TemplateData) => string;
	CMD_INFO_JOINED_TEXT: (data: TemplateData) => string;
	CMD_INFO_CREATED_TITLE: (data: TemplateData) => string;
	CMD_INFO_JOINS_TITLE: (data: TemplateData) => string;
	CMD_INFO_JOINS_ENTRY: (data: TemplateData) => string;
	CMD_INFO_JOINS_ENTRY_INV: (data: TemplateData) => string;
	CMD_INFO_JOINS_MORE: (data: TemplateData) => string;
	CMD_INFO_JOINS_UNKNOWN: (data: TemplateData) => string;
	CMD_INFO_REGULARINVITES_TITLE: (data: TemplateData) => string;
	CMD_INFO_REGULARINVITES_ENTRY: (data: TemplateData) => string;
	CMD_INFO_REGULARINVITES_MORE: (data: TemplateData) => string;
	CMD_INFO_REGULARINVITES_NONE: (data: TemplateData) => string;
	CMD_INFO_BONUSINVITES_TITLE: (data: TemplateData) => string;
	CMD_INFO_BONUSINVITES_ENTRY: (data: TemplateData) => string;
	CMD_INFO_BONUSINVITES_MORE: (data: TemplateData) => string;
	CMD_INFO_BONUSINVITES_NONE: (data: TemplateData) => string;
	CMD_INFO_INVITEDMEMBERS_TITLE: (data: TemplateData) => string;
	CMD_INFO_INVITEDMEMBERS_MORE: (data: TemplateData) => string;
	CMD_INFO_INVITEDMEMBERS_NONE: (data: TemplateData) => string;

	CMD_INVITECODES_TITLE: (data: TemplateData) => string;
	CMD_INVITECODES_NO_CODES: (data: TemplateData) => string;
	CMD_INVITECODES_RECOMMENDED_CODE_TITLE: (data: TemplateData) => string;
	CMD_INVITECODES_RECOMMENDED_CODE_NONE: (data: TemplateData) => string;
	CMD_INVITECODES_PERMANENT_TITLE: (data: TemplateData) => string;
	CMD_INVITECODES_PERMANENT_TEXT: (data: TemplateData) => string;
	CMD_INVITECODES_PERMANENT_ENTRY: (data: TemplateData) => string;
	CMD_INVITECODES_TEMPORARY_TITLE: (data: TemplateData) => string;
	CMD_INVITECODES_TEMPORARY_TEXT: (data: TemplateData) => string;
	CMD_INVITECODES_TEMPORARY_ENTRY: (data: TemplateData) => string;
	CMD_INVITECODES_DM_SENT: (data: TemplateData) => string;

	CMD_INVITES_AMOUNT: (data: TemplateData) => string;
	CMD_INVITES_NEXT_RANK: (data: TemplateData) => string;
	CMD_INVITES_HIGHEST_RANK: (data: TemplateData) => string;

	CMD_LEADERBOARD_TITLE: (data: TemplateData) => string;
	CMD_LEADERBOARD_INVALID_DATE: (data: TemplateData) => string;
	CMD_LEADERBOARD_NO_INVITES: (data: TemplateData) => string;
	CMD_LEADERBOARD_COMPARED_TO: (data: TemplateData) => string;
	CMD_LEADERBOARD_ROW_ENTRY: (data: TemplateData) => string;
	CMD_LEADERBOARD_COL_CHANGE: (data: TemplateData) => string;
	CMD_LEADERBOARD_COL_NAME: (data: TemplateData) => string;
	CMD_LEADERBOARD_COL_TOTAL: (data: TemplateData) => string;
	CMD_LEADERBOARD_COL_REGULAR: (data: TemplateData) => string;
	CMD_LEADERBOARD_COL_CUSTOM: (data: TemplateData) => string;
	CMD_LEADERBOARD_COL_FAKE: (data: TemplateData) => string;
	CMD_LEADERBOARD_COL_LEAVE: (data: TemplateData) => string;
	CMD_LEADERBOARD_TABLE_LEGEND: (data: TemplateData) => string;

	CMD_MEMBERCONFIG_TITLE: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_TEXT: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_KEY_NOT_FOUND: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_KEY_CANT_CLEAR: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_KEYS_TITLE: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_NOT_SET_ANY_TEXT: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_CURRENT_TITLE: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_PREVIOUS_TITLE: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_NEW_TITLE: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_CURRENT_SET_TEXT: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_CURRENT_NOT_SET_TEXT: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_ALREADY_SET_SAME_VALUE: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_CHANGED_TEXT: (data: TemplateData) => string;
	CMD_MEMBERCONFIG_NONE: (data: TemplateData) => string;

	CMD_MEMBERS_MEMBERS: (data: TemplateData) => string;
	CMD_MEMBERS_ONLINE: (data: TemplateData) => string;
	CMD_MEMBERS_HUMANS: (data: TemplateData) => string;
	CMD_MEMBERS_BOTS: (data: TemplateData) => string;
	CMD_MEMBERS_JOINED_DAY: (data: TemplateData) => string;
	CMD_MEMBERS_JOINED_WEEK: (data: TemplateData) => string;
	CMD_MEMBERS_JOINED_MONTH: (data: TemplateData) => string;

	CMD_RANKS_NONE: (data: TemplateData) => string;
	CMD_RANKS_ENTRY: (data: TemplateData) => string;
	CMD_RANKS_TITLE: (data: TemplateData) => string;

	CMD_REMOVERANK_RANK_NOT_FOUND: (data: TemplateData) => string;
	CMD_REMOVERANK_DONE: (data: TemplateData) => string;

	CMD_RESTOREINVITES_DONE: (data: TemplateData) => string;

	CMD_SETUP_TITLE: (data: TemplateData) => string;
	CMD_SETUP_TEXT: (data: TemplateData) => string;
	CMD_SETUP_JOINLEAVE_TITLE: (data: TemplateData) => string;
	CMD_SETUP_JOINLEAVE_TEXT: (data: TemplateData) => string;
	CMD_SETUP_PREFIX_TITLE: (data: TemplateData) => string;
	CMD_SETUP_PREFIX_TEXT: (data: TemplateData) => string;
	CMD_SETUP_FAQ_TITLE: (data: TemplateData) => string;
	CMD_SETUP_FAQ_TEXT: (data: TemplateData) => string;
	CMD_SETUP_HELP_TITLE: (data: TemplateData) => string;
	CMD_SETUP_HELP_TEXT: (data: TemplateData) => string;
	CMD_SETUP_PREMIUM_TITLE: (data: TemplateData) => string;
	CMD_SETUP_PREMIUM_TEXT: (data: TemplateData) => string;
	CMD_SETUP_MANAGE_GUILD_TITLE: (data: TemplateData) => string;
	CMD_SETUP_MANAGE_GUILD_TEXT: (data: TemplateData) => string;
	CMD_SETUP_MANAGE_ROLES_TITLE: (data: TemplateData) => string;
	CMD_SETUP_MANAGE_ROLES_TEXT: (data: TemplateData) => string;

	CMD_SUBTRACTFAKES_NO_INVITES: (data: TemplateData) => string;
	CMD_SUBTRACTFAKES_DONE: (data: TemplateData) => string;

	CMD_SUBTRACTLEAVES_NO_LEAVES: (data: TemplateData) => string;
	CMD_SUBTRACTLEAVES_DONE: (data: TemplateData) => string;
}
