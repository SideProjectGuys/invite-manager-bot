import { Command, Message, Logger, logger } from 'yamdbf';
import { RichEmbed } from 'discord.js';
import { createEmbed } from '../utils/util';
import { IMClient } from '../client';
const config = require('../../config.json');

export default class extends Command<IMClient> {
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

    // TODO: This is currently multiplied by the shard count, which is ok for guilds,
    // but inaccurate for the members count
    const embed = new RichEmbed();
    embed.addField('Guilds', message.client.guilds.size * this.client.shard.count, true);
    let allMembersCount = message.client.guilds.reduce((p, v) => v.memberCount + p, 0) * this.client.shard.count;
    embed.addField('Members', allMembersCount, true);
    if (config.botSupport) embed.addField('Support Discord', config.botSupport);
    if (config.botAdd) embed.addField('Add bot to your server', config.botAdd);
    if (config.botWebsite) embed.addField('Bot website', config.botWebsite);
    createEmbed(message.client, embed);

    message.channel.send({ embed });
  }
}
