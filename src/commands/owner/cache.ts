import { Message } from 'eris';

import { IMClient } from '../../client';
import { OwnerCommand } from '../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: OwnerCommand.cache,
			aliases: ['owner-cache', 'oc'],
			args: [],
			guildOnly: true,
			hidden: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ guild }: Context
	): Promise<any> {
		if (this.client.config.ownerGuildIds.indexOf(guild.id) === -1) {
			return;
		}

		const embed = this.client.createEmbed();
		embed.fields.push({
			name: 'Settings',
			value: this.client.cache.settings.getSize() + ' entries'
		});
		embed.fields.push({
			name: 'Premium',
			value: this.client.cache.premium.getSize() + ' entries'
		});
		embed.fields.push({
			name: 'Permissions',
			value: this.client.cache.permissions.getSize() + ' entries'
		});
		embed.fields.push({
			name: 'Strikes',
			value: this.client.cache.strikes.getSize() + ' entries'
		});
		embed.fields.push({
			name: 'Punishments',
			value: this.client.cache.punishments.getSize() + ' entries'
		});

		this.client.sendReply(message, embed);
	}
}
