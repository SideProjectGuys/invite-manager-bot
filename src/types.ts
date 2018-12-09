export enum Permissions {
	ADMINISTRATOR = 'administrator',
	READ_MESSAGES = 'readMessages',
	SEND_MESSAGES = 'sendMessages',
	EMBED_LINKS = 'embedLinks',
	MANAGE_GUILD = 'manageGuild',
	VIEW_AUDIT_LOGS = 'viewAuditLogs',
	MANAGE_ROLES = 'manageRoles',
	CREATE_INSTANT_INVITE = 'createInstantInvite',
	BAN_MEMBERS = 'banMembers',
	KICK_MEMBERS = 'kickMembers'
}

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
	Report = 'Report',
	Other = 'Other'
}

export enum ShardCommand {
	CUSTOM = 'CUSTOM',
	DIAGNOSE = 'DIAGNOSE',
	FLUSH_CACHE = 'FLUSH_CACHE',
	SUDO = 'SUDO',
	OWNER_DM = 'OWNER_DM',
	USER_DM = 'USER_DM',
	LEAVE_GUILD = 'LEAVE_GUILD'
}

export enum ChartType {
	joins = 'joins',
	leaves = 'leaves',
	usage = 'usage'
}

export enum BotCommand {
	config = 'config',
	inviteCodeConfig = 'inviteCodeConfig',
	memberConfig = 'memberConfig',
	permissions = 'permissions',
	interactiveConfig = 'interactiveConfig',

	botInfo = 'botInfo',
	credits = 'credits',
	getBot = 'getBot',
	help = 'help',
	members = 'members',
	ping = 'ping',
	prefix = 'prefix',
	setup = 'setup',
	support = 'support',

	createInvite = 'createInvite',
	addInvites = 'addInvites',
	clearInvites = 'clearInvites',
	fake = 'fake',
	info = 'info',
	inviteCodes = 'inviteCodes',
	inviteDetails = 'inviteDetails',
	invites = 'invites',
	leaderboard = 'leaderboard',
	removeInvites = 'removeInvites',
	restoreInvites = 'restoreInvites',
	subtractFakes = 'subtractFakes',
	subtractLeaves = 'subtractLeaves',

	export = 'export',
	premium = 'premium',
	tryPremium = 'tryPremium',

	addRank = 'addRank',
	ranks = 'ranks',
	removeRank = 'removeRank',

	makeMentionable = 'makeMentionable',
	mentionRole = 'mentionRole',

	report = 'report',

	graph = 'graph'
}

export enum ModerationCommand {
	autoMod = 'autoMod',
	punishment = 'punishment',
	punishmentConfig = 'punishmentConfig',
	strikeAdd = 'strikeAdd',
	strikeConfig = 'strikeConfig',
	strikeRemove = 'strikeRemove',

	ban = 'ban',
	unban = 'unban',
	kick = 'kick',
	softBan = 'softBan',
	warn = 'warn',
	mute = 'mute',
	unmute = 'unmute',

	check = 'check',
	caseDelete = 'caseDelete',
	caseView = 'caseView',

	clean = 'clean',
	cleanText = 'cleanText',
	cleanShort = 'cleanShort',
	purgeSafe = 'purgeSafe',
	purgeUntil = 'purgeUntil',
	purge = 'purge'
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
