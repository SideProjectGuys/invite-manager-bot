import { Client, Command, Message, Logger, logger } from 'yamdbf';
import { RichEmbed, User } from 'discord.js';
import { createEmbed } from '../utils/util';

export default class extends Command<Client> {
  @logger('Command')
  private readonly _logger: Logger;

  public constructor() {
    super({
      name: 'diagnose',
      aliases: ['diag', 'test', 'testBot', 'test-bot', 'faq'],
      desc: 'Bot will run some checks and show a list of issues that might exist on this server (e.g. permissions).',
      usage: '<prefix>test',
      callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
      hidden: true,
      guildOnly: true
    });
  }

  public async action(message: Message, [user]: [User]): Promise<any> {
    this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);
    let botMember = message.guild.members.get(message.guild.client.user.id);

    const embed = new RichEmbed();
    embed.setTitle('This command shows a list of common errors in case your bot is not working properly.');
    let embedText = '';
    if (message.guild.embedEnabled === undefined) {
      embedText = 'Unknown if embeds are enabled. If you can\'t see the bot responses, please make sure to enable rich embeds in your settings.';
    } else if (!message.guild.embedEnabled) {
      embedText = 'Embeds are disabled. You will most likely not see the bot resonses. Please enable rich embeds in your settings.';
    }
    if (embedText) embed.addField('Rich Embeds', embedText);

    let missingManageServerPermissions = '';
    if (!botMember.hasPermission('MANAGE_GUILD')) {
      missingManageServerPermissions = 'The bot does not have the "Manage Server" permissions. This permission is required to read the invites of the user. Without this permission the join messages and the following commands will not work:';
    }
    if (missingManageServerPermissions) {
      embed.addField('Permission missing: Manage Server', missingManageServerPermissions);
    }
    createEmbed(message.client, embed);
    message.channel.send({ embed });
  }
}
