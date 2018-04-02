import { Command, CommandDecorators, Message, Middleware, Logger, logger, KeyedStorage } from 'yamdbf';
import { Channel, RichEmbed } from 'discord.js';
import { createEmbed } from '../utils/util';
import { Op } from 'sequelize';
import { joins, inviteCodes, sequelize, members, customInvites } from '../sequelize';
import { IMClient } from '../client';
const { resolve } = Middleware;
const { using } = CommandDecorators;

const upSymbol = '🔺';
const downSymbol = '🔻';
const neutralSymbol = '▪️';

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

    const codeInvs = await inviteCodes.findAll({
      attributes: [
        [sequelize.fn('sum', sequelize.col('inviteCode.uses')), 'totalUses']
      ],
      where,
      group: 'inviteCode.inviterId',
      include: [{ model: members, as: 'inviter' }]
    });
    const bonusInvs = await customInvites.findAll({
      attributes: [
        [sequelize.fn('sum', sequelize.col('customInvite.amount')), 'totalAmount']
      ],
      where: {
        guildId: message.guild.id,
      },
      group: 'customInvite.memberId',
      include: [members]
    });

    const invs: { [x: string]: { name: string, code: number, bonus: number, oldCode: number, oldBonus: number } } = {};
    codeInvs.forEach(inv => {
      const id = inv.inviter.id;
      invs[id] = {
        name: inv.inviter.name,
        code: parseInt(inv.get('totalUses')),
        bonus: 0,
        oldCode: 0,
        oldBonus: 0,
      };
    });
    bonusInvs.forEach(inv => {
      const id = inv.member.id;
      if (invs[id]) {
        invs[id].bonus = parseInt(inv.get('totalAmount'));
      } else {
        invs[id] = {
          name: inv.member.name,
          code: 0,
          bonus: parseInt(inv.get('totalAmount')),
          oldCode: 0,
          oldBonus: 0,
        };
      }
    });

    const oldCodeInvs = await joins.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('join.id')), 'totalJoins']
      ],
      where: {
        guildId: message.guild.id,
        createdAt: {
          [Op.gt]: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
        }
      },
      group: ['exactMatch.inviterId'],
      include: [{
        model: inviteCodes,
        as: 'exactMatch',
        include: [{ model: members, as: 'inviter' }]
      }],
    });

    const oldBonusInvs = await customInvites.findAll({
      attributes: [
        [sequelize.fn('sum', sequelize.col('customInvite.amount')), 'totalAmount']
      ],
      where: {
        guildId: message.guild.id,
        createdAt: {
          [Op.gt]: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
        }
      },
      group: ['memberId'],
      include: [members]
    });

    oldCodeInvs.forEach(inv => {
      const id = inv.exactMatch.inviter.id;
      if (invs[id]) {
        invs[id].oldCode = parseInt(inv.get('totalJoins'));
      } else {
        invs[id] = {
          name: inv.exactMatch.inviter.name,
          code: 0,
          bonus: 0,
          oldCode: parseInt(inv.get('totalJoins')),
          oldBonus: 0,
        };
      }
    });
    oldBonusInvs.forEach(inv => {
      const id = inv.member.id;
      if (invs[id]) {
        invs[id].oldBonus = parseInt(inv.get('totalAmount'));
      } else {
        invs[id] = {
          name: inv.member.name,
          code: 0,
          bonus: 0,
          oldCode: 0,
          oldBonus: parseInt(inv.get('totalAmount')),
        };
      }
    });

    const keys = Object.keys(invs)
      .filter(k => invs[k].bonus + invs[k].code > 0)
      .sort((a, b) => (invs[b].code + invs[b].bonus) - (invs[a].code + invs[a].bonus));

    const leaderboard24hAgo = [...keys].sort((a, b) => (invs[b].code + invs[b].bonus - (invs[b].oldCode + invs[b].oldBonus)) -
      (invs[a].code + invs[a].bonus - (invs[a].oldCode + invs[a].oldBonus)));

    let str = '(changes compared to 1 day ago)\n\n';

    if (keys.length === 0) {
      str += 'No invites!';
    } else {
      keys.slice(0, 50).forEach((k, i) => {
        const inv = invs[k];

        const pos = i + 1;
        const prevPos = leaderboard24hAgo.indexOf(k) + 1;
        const posChange = (prevPos - i) - 1;

        const symbol = posChange > 0 ? upSymbol : (posChange < 0 ? downSymbol : neutralSymbol);
        const total = inv.code + inv.bonus;

        const posText = posChange > 0 ? '+' + posChange : (posChange === 0 ? '--' : posChange);
        str += `**${pos}.** (${posText}) ${symbol} <@${k}> **${total}** invites (**${inv.bonus}** bonus)\n`;
      });
    }

    const embed = new RichEmbed().setDescription(str);
    embed.setTitle(`Leaderboard ${channel ? 'for channel <#' + channel.id + '>' : ''}`);
    createEmbed(message.client, embed);

    message.channel.send({ embed });
  }
}
