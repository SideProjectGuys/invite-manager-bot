import { Emoji, PossiblyUncachedMessage, TextChannel } from 'eris';

import { IMClient } from '../../client';

export class ManagementService {
	private client: IMClient;

	public constructor(client: IMClient) {
		this.client = client;

		client.on('messageReactionAdd', this.onMessageReactionAdd.bind(this));
		client.on('messageReactionRemove', this.onMessageReactionRemove.bind(this));
	}

	public async onMessageReactionAdd(message: PossiblyUncachedMessage, emoji: Emoji, userId: string) {
		if (message.channel instanceof TextChannel) {
			const reactionRoles = await this.client.cache.reactionRoles.get(message.channel.guild.id);

			const reactionRole = reactionRoles.find(role => {
				if (role.channelId !== message.channel.id || role.messageId !== message.id) {
					return false;
				}
				const splits = role.emoji.split(':');
				if (splits.length === 1) {
					return emoji.name === splits[0];
				} else {
					return emoji.name === splits[0] && emoji.id === splits[1];
				}
			});
			if (reactionRole) {
				await this.client.addGuildMemberRole(message.channel.guild.id, userId, reactionRole.roleId);
			}
		}
	}

	public async onMessageReactionRemove(message: PossiblyUncachedMessage, emoji: Emoji, userId: string) {
		if (message.channel instanceof TextChannel) {
			const reactionRoles = await this.client.cache.reactionRoles.get(message.channel.guild.id);
			const reactionRole = reactionRoles.find(role => {
				if (role.channelId !== message.channel.id || role.messageId !== message.id) {
					return false;
				}
				const splits = role.emoji.split(':');
				if (splits.length === 1) {
					return emoji.name === splits[0];
				} else {
					return emoji.name === splits[0] && emoji.id === splits[1];
				}
			});
			if (reactionRole) {
				await this.client.removeGuildMemberRole(message.channel.guild.id, userId, reactionRole.roleId);
			}
		}
	}
}
