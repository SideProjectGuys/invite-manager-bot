import { CommandContext } from './framework/commands/Command';

export enum BotType {
	regular = 'regular',
	pro = 'pro',
	custom = 'custom'
}

export enum GuildPermission {
	ADMINISTRATOR = 'administrator',
	READ_MESSAGES = 'readMessages',
	SEND_MESSAGES = 'sendMessages',
	MANAGE_MESSAGES = 'manageMessages',
	EMBED_LINKS = 'embedLinks',
	MANAGE_GUILD = 'manageGuild',
	MANAGE_CHANNELS = 'manageChannels',
	VIEW_AUDIT_LOGS = 'viewAuditLogs',
	MANAGE_ROLES = 'manageRoles',
	CREATE_INSTANT_INVITE = 'createInstantInvite',
	BAN_MEMBERS = 'banMembers',
	KICK_MEMBERS = 'kickMembers',
	ADD_REACTIONS = 'addReactions',
	MANAGE_EMOJIS = 'manageEmojis',
	READ_MESSAGE_HISTORY = 'readMessageHistory'
}

export enum GuildFeature {
	INVITE_SPLASH = 'INVITE_SPLASH',
	VIP_REGIONS = 'VIP_REGIONS',
	VANITY_URL = 'VANITY_URL',
	VERIFIED = 'VERIFIED',
	PARTNERED = 'PARTNERED',
	PUBLIC = 'PUBLIC',
	COMMERCE = 'COMMERCE',
	NEWS = 'NEWS',
	DISCOVERABLE = 'DISCOVERABLE',
	FEATURABLE = 'FEATURABLE',
	ANIMATED_ICON = 'ANIMATED_ICON',
	BANNER = 'BANNER',
	PUBLIC_DISABLED = 'PUBLIC_DISABLED'
}

export enum ChannelType {
	GUILD_TEXT = 0,
	DM = 1,
	GUILD_VOICE = 2,
	GROUP_DM = 3,
	GUILD_CATEGORY = 4
}

export type InternalSettingsTypes =
	| 'Boolean'
	| 'Number'
	| 'Date'
	| 'String'
	| 'String[]'
	| 'Channel'
	| 'Channel[]'
	| 'Role'
	| 'Role[]'
	| 'Enum'
	| 'Enum[]';

export interface SettingsInfo<T> {
	type: InternalSettingsTypes;
	enumValues?: string[];
	grouping: string[];
	defaultValue: T;
	exampleValues?: string[];
	possibleValues?: string[];
	hasPremiumInfo?: boolean;
	clearable?: boolean;
	validate?: (key: string, value: any, ctx: CommandContext) => string | null;
}

export interface BasicUser {
	id: string;
	createdAt: number;
	username: string;
	avatarURL: string;
	discriminator: string;
}

export interface VanityInvite {
	code: string;
	uses: number;
}

export interface BasicInvite {
	code: string;
	channel: {
		id: string;
		name: string;
	};
}

export interface BasicMember {
	nick?: string;
	user: {
		id: string;
		username: string;
		discriminator: string;
		avatarURL: string;
	};
}
