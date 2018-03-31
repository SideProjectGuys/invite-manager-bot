import { Client, Command, CommandDecorators, GuildStorage, Message, Middleware, Logger, logger } from 'yamdbf';
import { RichEmbed, User } from 'discord.js';
const { resolve, expect } = Middleware;
const { using } = CommandDecorators;
import * as moment from 'moment';
import { createEmbed } from '../utils/util';
import { EStrings } from '../enums';

export default class extends Command<Client> {
  @logger('Command')
  private readonly _logger: Logger;

  public constructor() {
    super({
      name: 'info',
      aliases: ['showinfo'],
      desc: 'Show info about a specific member',
      usage: '<prefix>info @user',
      callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
      clientPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    });
  }

  @using(resolve('user: User'))
  @using(expect('user: User'))
  public async action(message: Message, [user]: [User]): Promise<any> {
    this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

    const storage: GuildStorage = message.guild.storage;
    // const settings: GuildSettings = message.guild.storage.settings;

    let member = message.guild.members.get(user.id);

    // TODO: Show current rank
    // let ranks = await settings.get('ranks');
    if (member) {
      // let memberJoins = await storage.get(`members.${member.id}.joins`);

      message.guild.fetchInvites().then(async invs => {
        invs = invs.filter(i => !i.temporary);
        invs = invs.filter(i => !!i.inviter); // Need to have valid inviter or we ignore it
        let personalInvites = invs.filter(i => i.inviter.id === member.id);
        let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);

        const embed = new RichEmbed().setTitle(member.user.username);
        let joinedAgo = moment(member.joinedAt).fromNow();
        embed.addField('Joined', joinedAgo, true);
        embed.addField('Invites', inviteCount, true);

        let invitedBy = 'unknown (this only works for new members)';
        let joins = await storage.get(`members.${member.id}.joins`);
        if (joins) {
          let joinCount = joins.length;
          embed.addField('Joined', `${joinCount} times`, true);
          let lastJoin = joins[joins.length - 1];
          if (lastJoin) {
            let codesUsed = lastJoin.inviteCodesUsed;
            if (codesUsed.length > 1) {
              invitedBy = 'Could not match inviter (multiple possibilities)';
            } else if (codesUsed.length === 1) {
              let inviter = await storage.get(`${EStrings.ALL_INVITE_CODES}.${codesUsed[0]}`);
              if (inviter) {
                let inviterMember = message.guild.members.get(inviter);
                if (inviterMember) {
                  invitedBy = `<@${inviterMember.user.id}>`;
                }
              }
            }
          }
        }

        let allMembers = await storage.get(`members`);
        let allInviteCodes = await storage.get(EStrings.ALL_INVITE_CODES);
        let trackedInviteCount = 0;
        let stillOnServerCount = 0;
        Object.keys(allMembers).forEach(key => {
          let tempMemberJoins = allMembers[key].joins;
          if (tempMemberJoins && tempMemberJoins.length > 0) {
            let tempInvite = tempMemberJoins[tempMemberJoins.length - 1];
            if (tempInvite && tempInvite.inviteCodesUsed && tempInvite.inviteCodesUsed.length === 1) {
              let inviteCode = tempInvite.inviteCodesUsed[0];
              let inviterUserId = allInviteCodes[inviteCode];
              if (inviterUserId && inviterUserId === member.id) {
                let inviter = message.guild.members.get(inviterUserId);
                if (inviter) {
                  stillOnServerCount++;
                }
                trackedInviteCount++;
              }
            }
          }
        });
        embed.addField('Invited by', invitedBy, true);

        if (stillOnServerCount === 0 && trackedInviteCount === 0) {
          embed.addField('Invited people still on the server (since bot joined)', `User did not invite any members since this bot joined.`);
        } else {
          embed.addField('Invited people still on the server (since bot joined)', `**${stillOnServerCount}** still here out of **${trackedInviteCount}** invited members.`);
        }

        createEmbed(message.client, embed);

        message.channel.send({ embed });
      });
    } else {
      message.channel.send('User is not part of your guild');
    }
  }
}
