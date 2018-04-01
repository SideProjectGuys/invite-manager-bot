import { Command, GuildSettings, Message, Logger, logger } from 'yamdbf';
import { RichEmbed } from 'discord.js';
import { createEmbed, subtractClearedCountFromInvites } from '../utils/util';
import { inviteCodes, ranks, IDBRank } from '../sequelize';
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
      clientPermissions: ['MANAGE_GUILD', 'MANAGE_ROLES'],
      guildOnly: true
    });
  }

  public async action(message: Message, args: string[]): Promise<any> {
    this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

    const personalInvitesCount = await inviteCodes.sum('uses', {
      where: {
        guildId: message.guild.id,
        inviterId: message.author.id,
      }
    });

    let textMessage = `You have **${personalInvitesCount}** invites!\n`;

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
        if (r.numInvites <= personalInvitesCount) { // Rank needs less/equal invites, so we add add role
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
      message.member.addRoles(rolesToAdd);
    }
    if (nextRank) {
      let nextRankPointsDiff = nextRank.numInvites - personalInvitesCount;
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
