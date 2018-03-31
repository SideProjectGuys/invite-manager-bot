import { Guild, GuildStorage } from 'yamdbf';
import { Client, RichEmbed, Invite, Collection, GuildMember } from 'discord.js';
import { EStrings } from '../enums';

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

export function getInviteCounts(invs: Collection<string, Invite>): { [key: string]: number } {
  invs = invs.filter(i => !i.temporary); // Filter out temporary invite codes
  invs = invs.filter(i => !!i.inviter); // Need to have valid inviter or we ignore it
  let localInvites: { [key: string]: number } = {};
  invs.forEach(value => {
    localInvites[value.code] = value.uses;
  });
  return localInvites;
}

export function getInviteOwners(invs: Collection<string, Invite>): { [key: string]: string } {
  invs = invs.filter(i => !i.temporary); // Filter out temporary invite codes
  invs = invs.filter(i => !!i.inviter); // Need to have valid inviter or we ignore it
  let localInvites: { [key: string]: string } = {};
  invs.forEach(value => {
    localInvites[value.code] = value.inviter.id;
  });
  return localInvites;
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

export function compareInvites(oldObj: { [key: string]: number }, newObj: { [key: string]: number }): string[] {
  let inviteCodesUsed: string[] = [];
  Object.keys(newObj).forEach(key => {
    if (newObj[key] !== 0 /* ignore new empty invites */ && oldObj[key] !== newObj[key]) {
      inviteCodesUsed.push(key);
    }
  });
  return inviteCodesUsed;
}

export async function getMembersByInviteCodes(guild: Guild, codes: string[]) {
  let inviteCodes = await guild.storage.get(EStrings.ALL_INVITE_CODES);
  let membersArray: GuildMember[] = [];
  codes.forEach(c => {
    let userId = inviteCodes[c];
    if (userId) {
      let member = guild.members.get(userId);
      if (member) {
        membersArray.push(member);
      }
    }
  });
  return membersArray;
}
