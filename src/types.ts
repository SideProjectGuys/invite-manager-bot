import { ResourceProxy } from '@yamdbf/core';

import { TranslationKeys } from './locale/Translations';

export type RP = ResourceProxy<TranslationKeys>;

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

	'setup' = 'setup',

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

	'chart' = 'chart'
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
