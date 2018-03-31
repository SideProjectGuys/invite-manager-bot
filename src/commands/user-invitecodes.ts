import { Client, Command, Message, Logger, logger } from 'yamdbf';
import { RichEmbed } from 'discord.js';
import { createEmbed, subtractClearedCountFromInvites } from '../utils/util';
import * as moment from 'moment';

export default class extends Command<Client> {
  @logger('Command')
  private readonly _logger: Logger;

  public constructor() {
    super({
      name: 'invite-codes',
      aliases: ['invite-code', 'get-invite-codes', 'getInviteCode', 'invite-codes', 'inviteCodes', 'InviteCode', 'getInviteCode', 'get-invite-code', 'showInviteCode', 'show-invite-code'],
      desc: 'Get a list of all your active invite codes',
      usage: '<prefix>invite-codes',
      clientPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    });
  }

  public async action(message: Message, args: string[]): Promise<any> {
    this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

    message.guild.fetchInvites().then(async invs => {
      invs = await subtractClearedCountFromInvites(message.guild.storage, invs);

      let personalInvites = invs.filter(i => i.inviter.id === message.author.id);
      let temporaryInvites = personalInvites.filter(i => i.maxAge > 0);
      let permanentInvites = personalInvites.filter(i => i.maxAge === 0);
      let recommendedCode = permanentInvites.reduce((max, val) => val.uses > max.uses ? val : max, permanentInvites.first());

      const embed = new RichEmbed();
      embed.setTitle(`You have the following codes on the server ${message.guild.name}`);

      if (permanentInvites.size === 0 && temporaryInvites.size === 0) {
        embed.setDescription(`You don't have any active invite codes. Please ask the moderators of the server how to create one.`);
      } else {
        if (recommendedCode) {
          embed.addField(`Recommended invite code`, `https://discord.gg/${recommendedCode.code}`);
        } else {
          embed.addField(`Recommended invite code`, `Please create a permanent invite code.`);
        }
      }
      if (permanentInvites.size > 0) {
        embed.addBlankField();
        embed.addField('Permanent', 'These invites don\'t expire.');
        permanentInvites.forEach(i => {
          embed.addField(`${i.code} (${i.maxAge > 0 ? 'Temporary' : 'Permanent'})`, `**Uses**: ${i.uses}\n**Max Age**:${i.maxAge}\n**Max Uses**: ${i.maxUses}\n**Channel**: #${i.channel.name}\n`, true);
        });
      }
      if (temporaryInvites.size > 0) {
        embed.addBlankField();
        embed.addField('Temporary', 'These invites expire after a certain time.');
        temporaryInvites.forEach(i => {
          let expiringTimestamp = i.createdTimestamp + i.maxAge * 1000;
          embed.addField(`${i.code} (${i.maxAge > 0 ? 'Temporary' : 'Permanent'})`, `**Uses**: ${i.uses}\n**Max Age**:${i.maxAge}\n**Max Uses**: ${i.maxUses}\n**Channel**: #${i.channel.name}\n**Expires in**: ${moment(expiringTimestamp).fromNow()}`, true);
        });
      }

      createEmbed(message.client, embed);

      message.author.send({ embed });
      message.reply('I sent you a DM with all your invite codes.');

    }).catch((e: any) => {
      console.log(e);
    });
  }
}
