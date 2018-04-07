import * as Sequelize from 'sequelize';
const config = require('../config.json');

export const sequelize = new Sequelize(config.sequelize);

export interface BaseAttributes {
	createdAt?: Date | number | string;
	updatedAt?: Date | number | string;
}

// ------------------------------------
// Members
// ------------------------------------
export interface MemberAttributes extends BaseAttributes {
	id: string;
	name: string;
}
export interface MemberInstance extends Sequelize.Instance<MemberAttributes>, MemberAttributes {
	getInviteCodes: Sequelize.HasManyGetAssociationsMixin<InviteCodeInstance>;
	getJoins: Sequelize.HasManyGetAssociationsMixin<JoinInstance>;
	getLeaves: Sequelize.HasManyGetAssociationsMixin<LeaveInstance>;
	getCustomInvites: Sequelize.HasManyGetAssociationsMixin<CustomInviteInstance>;
	// TODO: get custom invites via creatorId
	getPresences: Sequelize.HasManyGetAssociationsMixin<PresenceInstance>;
}

export const members = sequelize.define<MemberInstance, MemberAttributes>(
	'member',
	{
		id: { type: Sequelize.STRING, primaryKey: true },
		name: Sequelize.STRING
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

// ------------------------------------
// Guilds
// ------------------------------------
export interface GuildAttributes extends BaseAttributes {
	id: string;
	name: string;
	icon: string;
}
export interface GuildInstance extends Sequelize.Instance<GuildAttributes>, GuildAttributes {
	getRoles: Sequelize.HasManyGetAssociationsMixin<RoleInstance>;
	getChannels: Sequelize.HasManyGetAssociationsMixin<ChannelInstance>;
	getSettings: Sequelize.HasManyGetAssociationsMixin<SettingInstance>;
	getInviteCodes: Sequelize.HasManyGetAssociationsMixin<InviteCodeInstance>;
	getJoins: Sequelize.HasManyGetAssociationsMixin<JoinInstance>;
	getLeaves: Sequelize.HasManyGetAssociationsMixin<LeaveInstance>;
	getCustomInvites: Sequelize.HasManyGetAssociationsMixin<CustomInviteInstance>;
	getRanks: Sequelize.HasManyGetAssociationsMixin<RankInstance>;
	getPresences: Sequelize.HasManyGetAssociationsMixin<PresenceInstance>;
}

export const guilds = sequelize.define<GuildInstance, GuildAttributes>(
	'guild',
	{
		id: { type: Sequelize.STRING, primaryKey: true },
		name: Sequelize.STRING,
		icon: Sequelize.STRING,
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

// ------------------------------------
// Roles
// ------------------------------------
export interface RoleAttributes extends BaseAttributes {
	id: string;
	name: string;
	color: string;
	guildId: string;
}
export interface RoleInstance extends Sequelize.Instance<RoleAttributes>, RoleAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getRanks: Sequelize.HasManyGetAssociationsMixin<RankInstance>;
}

export const roles = sequelize.define<RoleInstance, RoleAttributes>(
	'role',
	{
		id: { type: Sequelize.STRING, primaryKey: true },
		name: Sequelize.STRING,
		color: Sequelize.STRING({ length: 7 }),
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

roles.belongsTo(guilds);
guilds.hasMany(roles);

// ------------------------------------
// Channels
// ------------------------------------
export interface ChannelAttributes extends BaseAttributes {
	id: string;
	name: string;
	guildId: string;
}
export interface ChannelInstance extends Sequelize.Instance<ChannelAttributes>, ChannelAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getInviteCodes: Sequelize.HasManyGetAssociationsMixin<InviteCodeInstance>;
}

export const channels = sequelize.define<ChannelInstance, ChannelAttributes>(
	'channel',
	{
		id: { type: Sequelize.STRING, primaryKey: true },
		name: Sequelize.STRING,
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

channels.belongsTo(guilds);
guilds.hasMany(channels);

// ------------------------------------
// Settings
// ------------------------------------
export enum SettingsKeys {
	prefix = 'prefix',
	joinMessageChannel = 'joinMessageChannel',
	lang = 'lang',
	modRole = 'modRole',
	modChannel = 'modChannel',
}

export interface SettingAttributes extends BaseAttributes {
	key: SettingsKeys;
	value: string;
	guildId: string;
}
export interface SettingInstance extends Sequelize.Instance<SettingAttributes>, SettingAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
}

export const settings = sequelize.define<SettingInstance, SettingAttributes>(
	'setting',
	{
		key: Sequelize.ENUM(
			SettingsKeys.prefix,
			SettingsKeys.joinMessageChannel,
			SettingsKeys.lang,
			SettingsKeys.modRole,
			SettingsKeys.modChannel,
		),
		value: Sequelize.STRING,
	},
	{
		timestamps: true,
		paranoid: true,
		indexes: [{
			unique: true,
			fields: ['guildId', 'key']
		}],
	}
);
settings.belongsTo(guilds);
guilds.hasMany(settings);

// ------------------------------------
// Invite Codes
// ------------------------------------
export interface InviteCodeAttributes extends BaseAttributes {
	code: string;
	channelId: string;
	maxAge: number;
	maxUses: number;
	uses: number;
	temporary: boolean;
	deletedAt?: Date;
	reason?: string;
	guildId: string;
	inviterId: string;
	inviter?: MemberInstance;
}
export interface InviteCodeInstance extends Sequelize.Instance<InviteCodeAttributes>, InviteCodeAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getInviter: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
	getJoins: Sequelize.HasManyGetAssociationsMixin<JoinInstance>;
}

export const inviteCodes = sequelize.define<InviteCodeInstance, InviteCodeAttributes>(
	'inviteCode',
	{
		code: { type: Sequelize.STRING() + ' CHARSET utf8mb4 COLLATE utf8mb4_bin', primaryKey: true },
		reason: Sequelize.STRING,
		maxAge: Sequelize.INTEGER,
		maxUses: Sequelize.INTEGER,
		uses: Sequelize.INTEGER,
		temporary: Sequelize.BOOLEAN,
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

inviteCodes.belongsTo(guilds);
guilds.hasMany(inviteCodes);

inviteCodes.belongsTo(channels);
channels.hasMany(inviteCodes);

inviteCodes.belongsTo(members, { as: 'inviter', foreignKey: 'inviterId' });
members.hasMany(inviteCodes, { foreignKey: 'inviterId' });

// ------------------------------------
// Joins
// ------------------------------------
export interface JoinAttributes extends BaseAttributes {
	id: number;
	exactMatchCode: string;
	exactMatch?: InviteCodeInstance;
	possibleMatches: string;
	guildId: string;
	guild?: GuildInstance;
	memberId: string;
	member?: MemberInstance;
}
export interface JoinInstance extends Sequelize.Instance<JoinAttributes>, JoinAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
	getExactMatch: Sequelize.BelongsToGetAssociationMixin<InviteCodeInstance>;
}

export const joins = sequelize.define<JoinInstance, JoinAttributes>(
	'join',
	{
		possibleMatches: Sequelize.STRING() + ' CHARSET utf8mb4 COLLATE utf8mb4_bin',
	},
	{
		timestamps: true,
		paranoid: true,
		indexes: [{
			unique: true,
			fields: ['guildId', 'memberId', 'createdAt']
		}],
	}
);

joins.belongsTo(guilds);
guilds.hasMany(joins);

joins.belongsTo(members);
members.hasMany(joins);

joins.belongsTo(inviteCodes, { as: 'exactMatch', foreignKey: 'exactMatchCode' });
inviteCodes.hasMany(joins, { foreignKey: 'exactMatchCode' });

// ------------------------------------
// Leaves
// ------------------------------------
export interface LeaveAttributes extends BaseAttributes {
	id: number;
	guildId: string;
	memberId: string;
}
export interface LeaveInstance extends Sequelize.Instance<LeaveAttributes>, LeaveAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const leaves = sequelize.define<LeaveInstance, LeaveAttributes>(
	'leave',
	{},
	{
		timestamps: true,
		paranoid: true,
	}
);

leaves.belongsTo(guilds);
guilds.hasMany(leaves);

leaves.belongsTo(members);
members.hasMany(leaves);

// ------------------------------------
// Custom Invites
// ------------------------------------
export interface CustomInviteAttributes extends BaseAttributes {
	id: number;
	amount: number;
	reason: string;
	generated: boolean;
	guildId: string;
	memberId: string;
	member?: MemberInstance;
	creatorId: string;
	creator?: MemberInstance;
}
export interface CustomInviteInstance extends Sequelize.Instance<CustomInviteAttributes>, CustomInviteAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
	getCreator: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const customInvites = sequelize.define<CustomInviteInstance, CustomInviteAttributes>(
	'customInvite',
	{
		amount: Sequelize.INTEGER,
		reason: Sequelize.STRING,
		generated: Sequelize.BOOLEAN,
	}
	,
	{
		timestamps: true,
		paranoid: true,
	}
);

customInvites.belongsTo(guilds);
guilds.hasMany(customInvites);

customInvites.belongsTo(members);
members.hasMany(customInvites);

customInvites.belongsTo(members, { as: 'creator', foreignKey: 'creatorId' });
members.hasMany(customInvites, { foreignKey: 'creatorId' });

// ------------------------------------
// Ranks
// ------------------------------------
export interface RankAttributes extends BaseAttributes {
	id: number;
	roleId: string;
	numInvites: number;
	description: string;
	guildId: string;
}
export interface RankInstance extends Sequelize.Instance<RankAttributes>, RankAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getRole: Sequelize.BelongsToGetAssociationMixin<RoleInstance>;
}

export const ranks = sequelize.define<RankInstance, RankAttributes>(
	'rank',
	{
		numInvites: Sequelize.INTEGER,
		description: Sequelize.STRING,
	},
	{
		timestamps: true,
		paranoid: true,
		indexes: [{
			unique: true,
			fields: ['guildId', 'roleId']
		}],
	}
);

ranks.belongsTo(guilds);
guilds.hasMany(ranks);

ranks.belongsTo(roles);
roles.hasMany(ranks);

// ------------------------------------
// Presences
// ------------------------------------
export enum PresenceStatus {
	ONLINE = 'on',
	OFFLINE = 'off'
}

export interface PresenceAttributes extends BaseAttributes {
	id: number;
	status: PresenceStatus;
	guildId: string;
	memberId: string;
}
export interface PresenceInstance extends Sequelize.Instance<PresenceAttributes>, PresenceAttributes {
	getGuild: Sequelize.BelongsToGetAssociationMixin<GuildInstance>;
	getMember: Sequelize.BelongsToGetAssociationMixin<MemberInstance>;
}

export const presences = sequelize.define<PresenceInstance, PresenceAttributes>(
	'presence',
	{
		status: {
			type: Sequelize.ENUM,
			values: ['on', 'off']
		}
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

presences.belongsTo(guilds);
guilds.hasMany(presences);

presences.belongsTo(members);
members.hasMany(presences);
