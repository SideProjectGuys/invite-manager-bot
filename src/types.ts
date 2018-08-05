import { ResourceProxy } from '@yamdbf/core';

import { TranslationKeys } from './locale/Translations';

export type RP = ResourceProxy<TranslationKeys>;

export enum CommandGroup {
	Invites = 'Invites',
	Ranks = 'Ranks',
	Config = 'Config',
	Info = 'Info',
	Premium = 'Premium',
	Other = 'Other'
}

export enum ShardCommand {
	'FLUSH_PREMIUM_CACHE' = 'FLUSH_PREMIUM_CACHE',
	'FLUSH_SETTINGS_CACHE' = 'FLUSH_SETTINGS_CACHE'
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

	'setup' = 'setup',

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

	'chart' = 'chart'
}
