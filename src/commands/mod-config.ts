import { Command, CommandDecorators, Message, Middleware, Logger, logger } from 'yamdbf';
import { RichEmbed, User } from 'discord.js';
const { resolve, expect } = Middleware;
const { using } = CommandDecorators;
import { createEmbed } from '../utils/util';
import { settings, SettingsKeys } from '../sequelize';
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
  public async action(message: Message, [key, _value]: [string, string]): Promise<any> {
    this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

    if (key) {
      const dbKey = Object.keys(SettingsKeys).find(k => k.toLowerCase() === key.toLocaleLowerCase());
      if (!dbKey) {
        message.channel.send(`No config setting called '${dbKey}' found.`);
        return;
      }

      const set = await settings.find({
        where: {
          guildId: message.guild.id,
          key: dbKey,
        }
      });

      if (_value) {
        const isNone = _value === 'none' || _value === 'empty' || _value === 'null';
        const value = isNone ? null : _value;

        if (set) {
          const oldVal = set.value;
          set.value = value;
          set.save();

          message.channel.send(`Changed **${dbKey}** from **${oldVal}** to **${value}**`);
        } else {
          settings.create({
            guildId: message.guild.id,
            key: dbKey,
            value,
          });

          message.channel.send(`Set **${dbKey}** to **${value}**`);
        }
      } else {
        if (!set) {
          message.channel.send(`Config **${dbKey}** is not set, please set a value.`);
        } else {
          message.channel.send(`Config **${dbKey}** is set to **${set.value}**`);
        }
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
