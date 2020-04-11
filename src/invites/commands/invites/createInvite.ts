import { Message, TextChannel } from 'eris';

import { IMClient } from '../../../client';
import { InviteCodeSettingsCache } from '../../../framework/cache/InviteCodeSettings';
import { CommandContext, IMCommand } from '../../../framework/commands/Command';
import { Cache } from '../../../framework/decorators/Cache';
import { ChannelResolver, StringResolver } from '../../../framework/resolvers';
import { GuildPermission } from '../../../types';
import { InvitesInviteCodeSettings } from '../../models/InviteCodeSettings';

export default class extends IMCommand {
	@Cache() private inviteCodeSettingsCache: InviteCodeSettingsCache;

	public constructor(client: IMClient) {
		super(client, {
			name: 'createInvite',
			aliases: ['create-invite'],
			args: [
				{
					name: 'name',
					resolver: StringResolver,
					required: true
				},
				{
					name: 'channel',
					resolver: ChannelResolver
				}
			],
			group: 'Invites',
			botPermissions: [GuildPermission.CREATE_INSTANT_INVITE],
			guildOnly: true,
			defaultAdminOnly: true,
			extraExamples: ['!createInvite reddit', '!createInvite website #welcome']
		});
	}

	public async action(
		message: Message,
		[name, _channel]: [string, TextChannel],
		flags: {},
		{ guild, t, me }: CommandContext
	): Promise<any> {
		const channel = _channel ? _channel : (message.channel as TextChannel);

		if (!channel.permissionsOf(me.id).has(GuildPermission.CREATE_INSTANT_INVITE)) {
			return this.sendReply(message, t('permissions.createInstantInvite'));
		}

		const inv = await this.client.createChannelInvite(
			channel.id,
			{
				maxAge: 0,
				maxUses: 0,
				temporary: false,
				unique: true
			},
			name ? encodeURIComponent(name) : undefined
		);

		await this.db.saveChannels([
			{
				id: inv.channel.id,
				name: inv.channel.name,
				guildId: guild.id
			}
		]);

		await this.db.saveInviteCodes([
			{
				code: inv.code,
				maxAge: 0,
				maxUses: 0,
				createdAt: new Date(inv.createdAt),
				temporary: false,
				channelId: inv.channel.id,
				uses: 0,
				guildId: inv.guild.id,
				inviterId: message.author.id,
				clearedAmount: 0,
				isVanity: false,
				isWidget: false
			}
		]);

		await this.inviteCodeSettingsCache.setOne<InvitesInviteCodeSettings>(guild.id, inv.code, 'name', name);

		return this.sendReply(
			message,
			t('cmd.createInvite.done', {
				code: `https://discord.gg/${inv.code}`,
				channel: `<#${channel.id}>`,
				name
			})
		);
	}
}
