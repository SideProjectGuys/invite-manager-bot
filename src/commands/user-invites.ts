import { Client, Command, GuildSettings, Message, Logger, logger } from 'yamdbf';
import { RichEmbed } from 'discord.js';
import { createEmbed, subtractClearedCountFromInvites } from '../utils/util';
import { IRank } from '../interfaces';

export default class extends Command<Client> {
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

    const settings: GuildSettings = message.guild.storage.settings;
    let ranks: IRank[] = await settings.get('ranks');

    if (!ranks) {
      ranks = [];
    }

    message.guild.fetchInvites().then(async invs => {
      invs = await subtractClearedCountFromInvites(message.guild.storage, invs);

      invs = invs.filter(i => !i.temporary);
      invs = invs.filter(i => !!i.inviter); // Need to have valid inviter or we ignore it
      let personalInvites = invs.filter(i => i.inviter.id === message.author.id);
      let personalInvitesCount = personalInvites.reduce((a, b) => a + b.uses, 0);
      let textMessage = `You have **${personalInvitesCount}** invites!\n`;

      let nextRankName = '';
      let nextRank: IRank = null;

      let rolesToAdd: string[] = [];
      ranks.forEach(r => {
        let role = message.guild.roles.get(r.roleid);
        if (role) {
          if (r.invitesNeeded <= personalInvitesCount) { // Rank needs less/equal invites, so we add add role
            if (!message.member.roles.has(role.id)) {
              rolesToAdd.push(role.id);
            }
          } else { // Rank requires more invites
            if (nextRank) {
              if (r.invitesNeeded < nextRank.invitesNeeded) { // Next rank is the one with lowest invites needed
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
        let nextRankPointsDiff = nextRank.invitesNeeded - personalInvitesCount;
        textMessage += 'You need **' + nextRankPointsDiff + '** more invites to reach **' + nextRankName + '** rank!';
      } else {
        if (ranks.length !== 0) {
          textMessage += 'Congratulations, you currently have the highest rank!';
        }
      }

      const embed = new RichEmbed();
      embed.setTitle(message.author.username);
      embed.setDescription(textMessage);
      createEmbed(message.client, embed);

      message.channel.send({ embed });
    }).catch((e: any) => {
      console.log(e);
    });
  }
}
