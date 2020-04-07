import { Emoji, PossiblyUncachedMessage, TextChannel } from 'eris';

import { Cache } from '../../framework/decorators/Cache';
import { Service } from '../../framework/decorators/Service';
import { DatabaseService } from '../../framework/services/Database';
import { IMService } from '../../framework/services/Service';
import { ReactionRoleCache } from '../cache/ReactionRoleCache';
import { Message } from '../models/Message';
import { ReactionRole } from '../models/ReactionRole';

enum TABLE {
	messages = '`messages`',
	reactionRoles = '`reactionRoles`'
}

export class ManagementService extends IMService {
	@Service() private db: DatabaseService;
	@Cache(() => ReactionRoleCache) private reactionRolesCache: ReactionRoleCache;

	public async init() {
		this.client.on('messageReactionAdd', this.onMessageReactionAdd.bind(this));
		this.client.on('messageReactionRemove', this.onMessageReactionRemove.bind(this));
	}

	public async getMessageById(guildId: string, messageId: string) {
		return this.db.findOne<Message>(guildId, TABLE.messages, '`guildId` = ? AND `id` = ?', [guildId, messageId]);
	}
	public async getMessagesForGuild(guildId: string) {
		return this.db.findMany<Message>(guildId, TABLE.messages, '`guildId` = ?', [guildId]);
	}
	public async saveMessage(message: Partial<Message>) {
		return this.db.insertOrUpdate(
			TABLE.messages,
			['guildId', 'channelId', 'id', 'content', 'embeds'],
			['content', 'embeds'],
			[message],
			(m) => m.guildId
		);
	}

	public async getReactionRolesForGuild(guildId: string) {
		return this.db.findMany<ReactionRole>(guildId, TABLE.reactionRoles, '`guildId` = ?', [guildId]);
	}
	public async saveReactionRole(reactionRole: Partial<ReactionRole>) {
		return this.db.insertOrUpdate(
			TABLE.reactionRoles,
			['guildId', 'channelId', 'messageId', 'emoji', 'roleId'],
			['roleId'],
			[reactionRole],
			(r) => r.guildId
		);
	}
	public async removeReactionRole(guildId: string, channelId: string, messageId: string, emoji: string) {
		await this.db.delete(
			guildId,
			TABLE.reactionRoles,
			'`guildId` = ? AND `channelId` = ? AND `messageId` = ? AND `emoji` = ?',
			[guildId, channelId, messageId, emoji]
		);
	}

	public async onMessageReactionAdd(message: PossiblyUncachedMessage, emoji: Emoji, userId: string) {
		if (message.channel instanceof TextChannel) {
			const reactionRoles = await this.reactionRolesCache.get(message.channel.guild.id);

			const reactionRole = reactionRoles.find((role) => {
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
			const reactionRoles = await this.reactionRolesCache.get(message.channel.guild.id);
			const reactionRole = reactionRoles.find((role) => {
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
