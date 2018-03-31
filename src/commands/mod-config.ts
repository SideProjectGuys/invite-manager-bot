import { Client, Command, CommandDecorators, Message, Middleware, Logger, logger } from 'yamdbf';
import { RichEmbed, User } from 'discord.js';
const { resolve, expect } = Middleware;
const { using } = CommandDecorators;
import { createEmbed } from '../utils/util';

export default class extends Command<Client> {
  @logger('Command')
  private readonly _logger: Logger;

  public constructor() {
    super({
      name: 'config',
      aliases: ['show-config', 'showConfig'],
      desc: 'Show config of this server.',
      usage: '<prefix>config',
      callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
      hidden: true,
      guildOnly: true
    });
  }

  @using(resolve('key: String, value: String'))
  @using(expect('key: String, value: String'))
  public async action(message: Message, [user]: [User]): Promise<any> {
    this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);
    const embed = new RichEmbed();
    createEmbed(message.client, embed);
    console.log(embed);
  }
}
