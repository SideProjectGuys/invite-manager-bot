import { Guild, GuildStorage } from 'yamdbf';
import { Client, RichEmbed, Invite, Collection, GuildMember } from 'discord.js';
import { EStrings } from '../enums';
import { inviteCodes, customInvites, ranks, IDBRank } from '../sequelize';

export function createEmbed(client: Client, embed: RichEmbed, color = '#00AE86'): RichEmbed {
  embed.setColor(color);
  if (client) {
    embed.setFooter('InviteManager.co', client.user.avatarURL);
  } else {
    embed.setFooter('InviteManager.co');
  }
  embed.setTimestamp();
  return embed;
}

export async function subtractClearedCountFromInvites(storage: GuildStorage, invs: Collection<string, Invite>) {
  let clearedInvites = await storage.get(EStrings.CLEARED_INVITES);
  if (clearedInvites) {
    invs.forEach(v => {
      if (clearedInvites[v.code]) {
        v.uses = v.uses - clearedInvites[v.code];
      }
    });
  }
  return invs;
}

export async function getInviteCounts(guildId: string, memberId: string): Promise<{ code: number, custom: number }> {
  return {
    code: await inviteCodes.sum('uses', {
      where: {
        guildId: guildId,
        inviterId: memberId,
      }
    }) || 0,
    custom: await customInvites.sum('amount', {
      where: {
        guildId: guildId,
        memberId: memberId,
      }
    }) || 0,
  };
}

export async function promoteIfQualified(guild: Guild, member: GuildMember, totalInvites: number) {
  let nextRankName = '';
  let nextRank: IDBRank = null;

  let rolesToAdd: string[] = [];
  const allRanks = await ranks.findAll({
    where: {
      guildId: guild.id,
    }
  });

  allRanks.forEach(r => {
    let role = guild.roles.get(r.roleId);
    if (role) {
      if (r.numInvites <= totalInvites) { // Rank needs less/equal invites, so we add add role
        if (!member.roles.has(role.id)) {
          rolesToAdd.push(role.id);
        }
      } else { // Rank requires more invites
        if (nextRank) {
          if (r.numInvites < nextRank.numInvites) { // Next rank is the one with lowest invites needed
            nextRank = r;
            nextRankName = role.name;
          }
        } else {
          nextRank = r;
          nextRankName = role.name;
        }
      }
    } else {
      console.log('ROLE DOESNT EXIST');
    }
  });

  if (rolesToAdd.length > 0) {
    if (guild.me.hasPermission('MANAGE_ROLES')) {
      member.addRoles(rolesToAdd);
    } else {
      // TODO: Notify user about the fact that he deserves a promotion, but it
      // cannot be given to him because of missing permissions
    }
  }

  return {
    numRanks: allRanks.length,
    nextRank,
    nextRankName,
  };
}
