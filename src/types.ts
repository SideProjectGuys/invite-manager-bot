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
	Other = 'Other'
}

export enum ShardCommand {
	'DIAGNOSE' = 'DIAGNOSE',
	'FLUSH_PREMIUM_CACHE' = 'FLUSH_PREMIUM_CACHE',
	'FLUSH_SETTINGS_CACHE' = 'FLUSH_SETTINGS_CACHE',
	'SUDO' = 'SUDO',
	'RESPONSE' = 'RESPONSE'
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

	'addInvites' = 'addInvites',
	'clearInvites' = 'clearInvites',
	'fake' = 'fake',
	'info' = 'info',
	'inviteCodes' = 'inviteCodes',
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
