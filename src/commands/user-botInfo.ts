import { Client, Command, Message, Logger, logger } from 'yamdbf';
import { RichEmbed } from 'discord.js';
import { createEmbed } from '../utils/util';
const config = require('../../config.json');

export default class extends Command<Client> {
  @logger('Command')
  private readonly _logger: Logger;

  public constructor() {
    super({
      name: 'botInfo',
      aliases: ['bot-info'],
      desc: 'Show info about the bot',
      usage: '<prefix>botInfo'
    });
  }

  public async action(message: Message, args: string[]): Promise<any> {
    this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

    const embed = new RichEmbed();
    embed.addField('Guilds', message.client.guilds.size, true);
    let allMembersCount = message.client.guilds.reduce((p, v) => v.memberCount + p, 0);
    embed.addField('Members', allMembersCount, true);
    if (config.botSupport) embed.addField('Support Discord', config.botSupport);
    if (config.botAdd) embed.addField('Add bot to your server', config.botAdd);
    if (config.botWebsite) embed.addField('Bot website', config.botWebsite);
    createEmbed(message.client, embed);

    message.channel.send({ embed });
  }
}
