import { Client, Command, GuildStorage, Message, Logger, logger } from 'yamdbf';
import { getInviteCounts } from '../utils/util';
import { EStrings } from '../enums';

export default class extends Command<Client> {
  @logger('Command')
  private readonly _logger: Logger;

  public constructor() {
    super({
      name: 'clearInvites',
      aliases: ['clear-invites'],
      desc: 'Clear all previous invites!',
      usage: '<prefix>clearInvites',
      callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
      clientPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    });
  }

  public async action(message: Message, args: string[]): Promise<any> {
    this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

    const storage: GuildStorage = message.guild.storage;
    message.guild.fetchInvites().then(async invs => {
      let inviteCounts = getInviteCounts(invs);

      await storage.set(EStrings.CLEARED_INVITES, inviteCounts);
      let invitesCount = 0;
      Object.keys(inviteCounts).forEach(i => {
        invitesCount += inviteCounts[i];
      });
      message.channel.send(`Cleared ${invitesCount} invites!`);
    }).catch(console.log);
  }
}
