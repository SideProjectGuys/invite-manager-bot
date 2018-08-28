export enum PromptResult {
	SUCCESS,
	FAILURE,
	TIMEOUT
}

export enum CommandGroup {
	Invites = 'Invites',
	Ranks = 'Ranks',
	Config = 'Config',
	Info = 'Info',
	Premium = 'Premium',
	Moderation = 'Moderation',
	Other = 'Other'
}

export enum ShardCommand {
	'DIAGNOSE' = 'DIAGNOSE',
	'FLUSH_PREMIUM_CACHE' = 'FLUSH_PREMIUM_CACHE',
	'FLUSH_SETTINGS_CACHE' = 'FLUSH_SETTINGS_CACHE',
	'SUDO' = 'SUDO',
	'RESPONSE' = 'RESPONSE',
	'OWNER_DM' = 'OWNER_DM',
	'USER_DM' = 'USER_DM'
}

export enum ChartType {
	joins = 'joins',
	leaves = 'leaves',
	usage = 'usage'
}

export enum BotCommand {
	'config' = 'config',
	'inviteCodeConfig' = 'inviteCodeConfig',
	'memberConfig' = 'memberConfig',
	'permissions' = 'permissions',

	'getBot' = 'getBot',
	'botInfo' = 'botInfo',
	'prefix' = 'prefix',
	'setup' = 'setup',
	'support' = 'support',
	'help' = 'help',

	'createInvite' = 'createInvite',
	'addInvites' = 'addInvites',
	'clearInvites' = 'clearInvites',
	'fake' = 'fake',
	'info' = 'info',
	'inviteCodes' = 'inviteCodes',
	'inviteDetails' = 'inviteDetails',
	'invites' = 'invites',
	'leaderboard' = 'leaderboard',
	'members' = 'members',
	'restoreInvites' = 'restoreInvites',
	'subtractFakes' = 'subtractFakes',
	'subtractLeaves' = 'subtractLeaves',

	'export' = 'export',
	'premium' = 'premium',
	'tryPremium' = 'tryPremium',

	'addRank' = 'addRank',
	'ranks' = 'ranks',
	'removeRank' = 'removeRank',

	'makeMentionable' = 'makeMentionable',
	'mentionRole' = 'mentionRole',

	'graph' = 'graph'
}

export enum ModerationCommand {
	'automod' = 'automod',
	'punishment' = 'punishment',
	'strikeAdd' = 'strike-add',
	'strikeConfig' = 'strikeConfig',
	'strikeRemove' = 'strike-remove',

	'ban' = 'ban',
	'caseDelete' = 'case-delete',
	'caseUpdate' = 'case-update',
	'caseView' = 'case-view',
	'kick' = 'kick',
	'mute' = 'mute',
	'softban' = 'softban',
	'unmute' = 'unmute',
	'warn' = 'warn',

	'check' = 'check',

	'clean' = 'clean',
	'purgeSafe' = 'purge-safe',
	'purgeUntil' = 'purge-until',
	'purge' = 'purge',
}

export enum OwnerCommand {
	'diagnose' = 'ownerDiagnose',
	'dm' = 'ownerDm',
	'flushPremium' = 'ownerFlushPremium',
	'givePremium' = 'ownerGivePremium',
	'help' = 'ownerHelp',
	'sudo' = 'sudo'
}

export interface RabbitMqMember {
	id: string;
	nick?: string;
	user: {
		id: string;
		avatarUrl: string | null;
		createdAt: number;
		bot: boolean;
		discriminator: string;
		username: string;
	};
}
