import { Client, Command, GuildStorage, Message, Logger, logger } from 'yamdbf';
import { RichEmbed } from 'discord.js';
import { createEmbed, getMembersByInviteCodes } from '../utils/util';
import { inviteCodes, joins, members, sequelize } from '../sequelize';

export default class extends Command<Client> {
  @logger('Command')
  private readonly _logger: Logger;

  public constructor() {
    super({
      name: 'fake',
      aliases: ['fakes', 'cheaters', 'cheater', 'invalid'],
      desc: 'Show which person joined this server multiple times and by whom he was invited',
      usage: '<prefix>fake',
      // callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
      clientPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    });
  }

  public async action(message: Message, args: string[]): Promise<any> {
    this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

    const js = await joins.findAll({
      attributes: [
        'exactMatch',
        'possibleMatches',
        [sequelize.fn('count', sequelize.col('join.id')), 'totalJoins']
      ],
      where: {
        guildId: message.guild.id,
      },
      group: ['join.memberId'],
      include: [
        members,
        { model: inviteCodes, where: { exactMatch: 'code' }, required: false },
      ],
    });

    console.log(js.map(j => j.get({ plain: true })));

    if (js.length > 0) {
      const suspiciousMembers = js
        .filter(j => parseInt(j.get('totalJoins')) > 1)
        .sort((a, b) => a.get('totalJoins') - b.get('totalJoins'));

      const embed = new RichEmbed();
      embed.setTitle('Fake invites:');
      let description = '';
      let guildWithAllMembers = await message.guild.fetchMembers();

      /*for (let m of suspiciousMembers) {
        let members = await getMembersByInviteCodes(guildWithAllMembers, m.invitedBy);
        let membersInvitedStrings: string[] = [];
        let occurances = members.reduce((a: any, b) => {
          if (a[b.user.username]) {
            a[b.user.username]++;
          } else {
            a[b.user.username] = 1;
          }
          return a;
        }, {});
        Object.keys(occurances).forEach(o => {
          membersInvitedStrings.push(`${o} (${occurances[o]} times)`);
        });
        let member = message.guild.members.get(m.userID);
        if (member) {
          description += `**${member.user.username}** invited by: ${membersInvitedStrings.join(', ')}\n`;
        }
      }
      if (suspiciousMembers.length === 0) {
        description = 'There have been no fake invites since the bot has been added to this server.';
      }
      embed.setDescription(description);
      createEmbed(message.client, embed);
      message.channel.send({ embed });*/
    } else {
      message.channel.send(`No fake invites detected so far.`);
    }
  }
}
