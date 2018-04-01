import { Command, Message, Logger, logger } from 'yamdbf';
import { RichEmbed } from 'discord.js';
import { createEmbed, subtractClearedCountFromInvites } from '../utils/util';
import { inviteCodes, ranks, IDBRank, customInvites } from '../sequelize';
import { IMClient } from '../client';

export default class extends Command<IMClient> {
  @logger('Command')
  private readonly _logger: Logger;

  public constructor() {
    super({
      name: 'invites',
      aliases: ['invite', 'rank'],
      desc: 'Show personal invites',
      usage: '<prefix>invites',
      clientPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    });
  }

  public async action(message: Message, args: string[]): Promise<any> {
    this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

    const invAmount = await inviteCodes.sum('uses', {
      where: {
        guildId: message.guild.id,
        inviterId: message.author.id,
      }
    }) || 0;
    const customInvAmount = await customInvites.sum('amount', {
      where: {
        guildId: message.guild.id,
        memberId: message.author.id,
      }
    }) || 0;
    const totalInvites = invAmount + customInvAmount;

    let textMessage = `You have **${totalInvites}** invites! (**${customInvAmount}** bonus)\n`;

    let nextRankName = '';
    let nextRank: IDBRank = null;

    let rolesToAdd: string[] = [];
    const allRanks = await ranks.findAll({
      where: {
        guildId: message.guild.id,
      }
    });

    allRanks.forEach(r => {
      let role = message.guild.roles.get(r.roleId);
      if (role) {
        if (r.numInvites <= totalInvites) { // Rank needs less/equal invites, so we add add role
          if (!message.member.roles.has(role.id)) {
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
      if (message.guild.me.hasPermission('MANAGE_ROLES')) {
        message.member.addRoles(rolesToAdd);
      } else {
        // TODO: Notify user about the fact that he deserves a promotion, but it
        // cannot be given to him because of missing permissions
      }
    }

    if (nextRank) {
      let nextRankPointsDiff = nextRank.numInvites - totalInvites;
      textMessage += 'You need **' + nextRankPointsDiff + '** more invites to reach **' + nextRankName + '** rank!';
    } else {
      if (allRanks.length !== 0) {
        textMessage += 'Congratulations, you currently have the highest rank!';
      }
    }

    const embed = new RichEmbed();
    embed.setTitle(message.author.username);
    embed.setDescription(textMessage);
    createEmbed(message.client, embed);

    message.channel.send({ embed });
  }
}
