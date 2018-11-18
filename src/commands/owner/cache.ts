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
			strict: true,
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

		let channels =
			this.client.groupChannels.size + this.client.privateChannels.size;
		let roles = 0;

		this.client.guilds.forEach(g => {
			channels += g.channels.size;
			roles += g.roles.size;
		});

		const embed = this.client.createEmbed();
		embed.fields.push({
			name: 'Guilds',
			value: this.client.guilds.size + ' entries'
		});
		embed.fields.push({
			name: 'Users',
			value: this.client.users.size + ' entries'
		});
		embed.fields.push({
			name: 'Channels',
			value: channels + ' entries'
		});
		embed.fields.push({
			name: 'Roles',
			value: roles + ' entries'
		});
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
