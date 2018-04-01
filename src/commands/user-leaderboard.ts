import { Command, CommandDecorators, Message, Middleware, Logger, logger } from 'yamdbf';
import { Channel, RichEmbed } from 'discord.js';
import { createEmbed, subtractClearedCountFromInvites } from '../utils/util';
import { IMemberInviteCount } from '../interfaces';
import { inviteCodes, sequelize, members } from '../sequelize';
import { IMClient } from '../client';
const { resolve } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
  @logger('Command')
  private readonly _logger: Logger;

  public constructor() {
    super({
      name: 'leaderboard',
      aliases: ['top'],
      desc: 'Show members with most invites. You can pass it a channel and only invites in that channel will be counted.',
      usage: '<prefix>leaderboard (#channel)',
      clientPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    });
  }

  @using(resolve('channel: Channel'))
  public async action(message: Message, [channel]: [Channel]): Promise<any> {
    this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

    const where: { guildId: string, channelId?: string } = {
      guildId: message.guild.id,
    };
    if (channel) {
      where.channelId = channel.id;
    }

    let invites = await inviteCodes.findAll({
      attributes: [
        'inviterId',
        [sequelize.fn('sum', sequelize.col('inviteCode.uses')), 'totalUses']
      ],
      where,
      group: 'inviteCode.inviterId',
      order: [[sequelize.fn('sum', sequelize.col('inviteCode.uses')) as any, 'DESC']],
      include: [{ model: members, as: 'inviter' }]
    });
    invites = invites.filter(inv => parseInt(inv.get('totalUses')) > 0);
    console.log(invites);

    let str = `Leaderboard ${channel ? 'for channel <#' + channel.id + '>' : ''}\n\n`;

    // TODO: Compare to 1 day ago
    // let upSymbol = '🔺';
    // let downSymbol = '🔻';
    // let neutralSymbol = '▪️';
    if (invites.length === 0) {
      str += 'No invites!';
    } else {
      invites.forEach((inv, i) => {
        if (i < 50) {
          str += (i + 1) + ' ▪️ **' + inv.inviter.name + '** ' + inv.get('totalUses') + ' invites\n';
        }
      });
    }

    const embed = new RichEmbed().setDescription(str);
    createEmbed(message.client, embed);

    message.channel.send({ embed });
  }
}
