import { Client } from 'yamdbf';
import { TextChannel } from 'discord.js';
const config = require('../../config.json');

export class MessageQueue {
  private client: Client = null;
  private messages: string[] = [];

  public constructor(client: Client) {
    this.client = client;

    setInterval(() => {
      this.sendMessages();
    }, 2000);
  }

  public addMessage(message: string) {
    this.messages.push(`${new Date().toISOString()} - ${message}`);
  }

  private sendMessages() {
    if (this.messages.length === 0) return;
    // tslint:disable-next-line
    let channel = <TextChannel>this.client.channels.get(config.logChannel);
    if (channel) {
      channel.send(this.messages.join('\n'));
      this.messages = [];
    }
  }
}
