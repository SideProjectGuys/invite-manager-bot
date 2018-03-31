import { Client, Command, CommandDecorators, Message, Middleware, Logger, logger } from 'yamdbf';
import { Channel, RichEmbed } from 'discord.js';
import { createEmbed, subtractClearedCountFromInvites } from '../utils/util';
import { IMemberInviteCount } from '../interfaces';
const { resolve } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<Client> {
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

    message.guild.fetchInvites().then(async invs => {
      invs = await subtractClearedCountFromInvites(message.guild.storage, invs);
      let tempInvites: { [key: string]: IMemberInviteCount } = {};

      invs = invs.filter(i => !i.temporary); // No temporary invites
      invs = invs.filter(i => !!i.inviter); // Need to have valid inviter or we ignore it
      if (channel) {
        invs = invs.filter(i => i.channel.id === channel.id); // Filter channel
      }

      invs.forEach(i => {
        if (!tempInvites[i.inviter.id]) {
          tempInvites[i.inviter.id] = {
            name: i.inviter.username,
            invites: 0
          };
        }
        tempInvites[i.inviter.id].invites += i.uses;
      });

      let leaderboard: IMemberInviteCount[] = [];
      Object.keys(tempInvites).forEach(ti => {
        leaderboard.push(tempInvites[ti]);
      });
      leaderboard = leaderboard.filter(l => l.invites > 0).sort((a, b) => {
        return b.invites - a.invites;
      });

      let str = `Leaderboard ${channel ? 'for channel <#' + channel.id + '>' : ''}\n\n`;

      // TODO: Compare to 1 day ago
      // let upSymbol = '🔺';
      // let downSymbol = '🔻';
      // let neutralSymbol = '▪️';
      if (leaderboard.length === 0) {
        str += 'No invites!';
      } else {
        leaderboard.forEach((l, i) => {
          if (i < 50) {
            str += (i + 1) + ' ▪️ **' + l.name + '** ' + l.invites + ' invites\n';
          }
        });
      }

      const embed = new RichEmbed()
        .setDescription(str);

      createEmbed(message.client, embed);

      message.channel.send({ embed });
    });
  }
}
