import { Command, CommandDecorators, Message, Middleware, Logger, logger } from 'yamdbf';
import { RichEmbed, User } from 'discord.js';
const { resolve, expect } = Middleware;
const { using } = CommandDecorators;
import { createEmbed } from '../utils/util';
import { settings } from '../sequelize';
import { IMClient } from '../client';

export default class extends Command<IMClient> {
  @logger('Command')
  private readonly _logger: Logger;

  public constructor() {
    super({
      name: 'config',
      aliases: ['show-config', 'showConfig'],
      desc: 'Show config of this server.',
      usage: '<prefix>config (key (value))',
      callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
      hidden: true,
      guildOnly: true
    });
  }

  @using(resolve('key: String, value: String'))
  public async action(message: Message, [key, value]: [string, string]): Promise<any> {
    this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

    if (key) {
      const set = await settings.find({
        where: {
          guildId: message.guild.id,
          key: key,
        }
      });

      if (!set) {
        message.channel.send(`No config setting called '${key}' found.`);
        return;
      }

      if (value) {
        const oldVal = set.value;
        set.value = value;
        set.save();

        message.channel.send(`Changed **${key}** from **${oldVal}** to **${value}**`);
      } else {
        message.channel.send(`Config **${key}** is set to **${set.value}**`);
      }
    } else {
      const sets = await settings.findAll({
        where: {
          guildId: message.guild.id,
        }
      });

      const embed = new RichEmbed();

      sets.forEach(set => {
        embed.addField(set.key, set.value);
      });

      createEmbed(message.client, embed);
      message.channel.send({ embed });
    }
  }
}
