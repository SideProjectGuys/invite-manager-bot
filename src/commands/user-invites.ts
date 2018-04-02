import { Command, Message, Logger, logger } from 'yamdbf';
import { RichEmbed } from 'discord.js';
import { createEmbed, getInviteCounts, promoteIfQualified } from '../utils/util';
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

    const invites = await getInviteCounts(message.guild.id, message.author.id);
    const totalInvites = invites.code + invites.custom;

    let textMessage = `You have **${totalInvites}** invites! (**${invites.custom}** bonus)\n`;

    if (!message.member.user.bot) {
      const { nextRank, nextRankName, numRanks } = await promoteIfQualified(message.guild, message.member, totalInvites);

      if (nextRank) {
        let nextRankPointsDiff = nextRank.numInvites - totalInvites;
        textMessage += 'You need **' + nextRankPointsDiff + '** more invites to reach **' + nextRankName + '** rank!';
      } else {
        if (numRanks > 0) {
          textMessage += 'Congratulations, you currently have the highest rank!';
        }
      }
    }

    const embed = new RichEmbed();
    embed.setTitle(message.author.username);
    embed.setDescription(textMessage);
    createEmbed(message.client, embed);

    message.channel.send({ embed });
  }
}
