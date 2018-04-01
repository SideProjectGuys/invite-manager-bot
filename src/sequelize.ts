import * as Sequelize from 'sequelize';
const config = require('../config.json');

export const sequelize = new Sequelize(config.sequelize);

export interface ISequelizeBaseType {
  createdAt: Date;
  updatedAt: Date;
}

export interface IDBMember extends ISequelizeBaseType {
  id: string;
  name: string;
}

export const members = sequelize.define('member', {
  id: { type: Sequelize.STRING, primaryKey: true },
  name: Sequelize.STRING
});

export interface IDBGuild extends ISequelizeBaseType {
  id: string;
  name: string;
}

export const guilds = sequelize.define('guild', {
  id: { type: Sequelize.STRING, primaryKey: true },
  name: Sequelize.STRING,
  icon: Sequelize.STRING,
});

export const settings = sequelize.define('setting', {
  key: Sequelize.STRING,
  value: Sequelize.STRING,
});
settings.belongsTo(guilds);

export interface IDBJoin extends ISequelizeBaseType {
  id: number;
  exactMatch: string;
  possibleMatches: string;
  guildId: string;
  memberId: string;
}

export const joins = sequelize.define<any, any>('join',
  {
    exactMatch: Sequelize.STRING,
    possibleMatches: Sequelize.STRING,
  }, {
    indexes: [{
      unique: true,
      fields: ['guildId', 'memberId', 'createdAt']
    }],
  }
);

joins.belongsTo(guilds);
joins.belongsTo(members);

export interface IDBLeave extends ISequelizeBaseType {
  id: number;
  guildId: string;
  inviterId: string;
}

export const leaves = sequelize.define('leave', {});

leaves.belongsTo(guilds);
leaves.belongsTo(members);

export interface IDBInviteCode extends ISequelizeBaseType {
  id: number;
  exactMatch: string;
  possibleMatches: string;
  guildId: string;
  memberId: string;
}

export const inviteCodes = sequelize.define<any, any>('inviteCode', {
  code: Sequelize.STRING,
  channelId: Sequelize.STRING,
  isNative: Sequelize.BOOLEAN,
  reason: Sequelize.STRING,
  maxAge: Sequelize.INTEGER,
  maxUses: Sequelize.INTEGER,
  uses: Sequelize.INTEGER,
  temporary: Sequelize.BOOLEAN,
  deletedAt: Sequelize.DATE,
});

inviteCodes.belongsTo(guilds);
inviteCodes.belongsTo(members, { as: 'inviter' });

export interface IDBRank extends ISequelizeBaseType {
  id: number;
  roleId: string;
  numInvites: number;
  description: string;
}

export const ranks = sequelize.define<any, any>('rank',
  {
    roleId: Sequelize.STRING,
    numInvites: Sequelize.INTEGER,
    description: Sequelize.STRING,
  }, {
    indexes: [{
      unique: true,
      fields: ['guildId', 'roleId']
    }],
  }
);

ranks.belongsTo(guilds);

export enum DBPresences {
  ONLINE = 'on',
  OFFLINE = 'off'
}

export interface IDBPresence extends ISequelizeBaseType {
  id: number;
  status: DBPresences;
  guildId: string;
  memberId: string;
}

export const presences = sequelize.define('presence', {
  status: {
    type: Sequelize.ENUM,
    values: ['on', 'off']
  }
});

presences.belongsTo(guilds);
presences.belongsTo(members);
