import { Message, Role } from 'eris';

import { IMClient } from '../../../client';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { Service } from '../../../framework/decorators/Service';
import { BooleanResolver, RoleResolver, StringResolver } from '../../../framework/resolvers';
import { CommandGroup, GuildPermission } from '../../../types';
import { ReactionRoleCache } from '../../cache/ReactionRoleCache';
import { ManagementService } from '../../services/ManagementService';

const THUMBS_UP = '👍';
const CUSTOM_EMOJI_REGEX = /<(?:.*)?:(\w+):(\d+)>/;

export default class extends IMCommand {
	@Service() private mgmt: ManagementService;
	@Cache() private reactionRolesCache: ReactionRoleCache;

	public constructor(client: IMClient) {
		super(client, {
			name: 'reactionRole',
			aliases: ['rr'],
			args: [
				{
					name: 'messageId',
					resolver: StringResolver,
					required: true
				},
				{
					name: 'emoji',
					resolver: StringResolver,
					required: true
				},
				{
					name: 'role',
					resolver: RoleResolver,
					required: false
				}
			],
			flags: [
				{
					name: 'remove',
					resolver: BooleanResolver,
					short: 'r'
				}
			],
			group: CommandGroup.Other,
			botPermissions: [GuildPermission.MANAGE_MESSAGES],
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(
		message: Message,
		[messageId, emoji, role]: [string, string, Role],
		{ remove }: { remove: boolean },
		{ t, guild }: CommandContext
	): Promise<any> {
		const dbMessage = await this.mgmt.getMessageById(guild.id, messageId);

		if (!dbMessage) {
			return this.sendReply(message, t('cmd.reactionRole.noMessageFoundInDatabase'));
		}

		const matches = emoji.match(CUSTOM_EMOJI_REGEX);
		const emojiId = matches ? `${matches[1]}:${matches[2]}` : emoji;

		if (remove) {
			await this.mgmt.removeReactionRole(dbMessage.guildId, dbMessage.channelId, dbMessage.id, emojiId);
			await this.client.removeMessageReaction(dbMessage.channelId, dbMessage.id, emojiId);
		} else {
			const reactionRole = {
				guildId: dbMessage.guildId,
				channelId: dbMessage.channelId,
				messageId: dbMessage.id,
				roleId: role.id,
				emoji: emojiId
			};

			try {
				await this.client.addMessageReaction(dbMessage.channelId, dbMessage.id, emojiId);
				await this.mgmt.saveReactionRole(reactionRole);
			} catch (error) {
				if (error.code === 10014) {
					await this.sendReply(message, t('cmd.reactionRole.unknownEmoji'));
				} else {
					throw error;
				}
			}
		}

		this.reactionRolesCache.flush(guild.id);

		await this.client.addMessageReaction(message.channel.id, message.id, THUMBS_UP);
	}
}
