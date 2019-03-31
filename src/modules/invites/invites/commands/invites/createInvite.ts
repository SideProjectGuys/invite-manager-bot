import { Message, TextChannel } from 'eris';

import { IMClient } from '../../../../../client';
import {
	ChannelResolver,
	StringResolver
} from '../../../../../framework/resolvers';
import {
	channels,
	inviteCodes,
	InviteCodeSettingsKey
} from '../../../../../sequelize';
import { BotCommand, CommandGroup, Permissions } from '../../../../../types';
import { Command, Context } from '../../../../../framework/commands/Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.createInvite,
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
			group: CommandGroup.Invites,
			guildOnly: true,
			strict: true
		});
	}

	public async action(
		message: Message,
		[name, _channel]: [string, TextChannel],
		flags: {},
		{ guild, t, me }: Context
	): Promise<any> {
		const channel = _channel ? _channel : (message.channel as TextChannel);

		if (!channel.permissionsOf(me.id).has(Permissions.CREATE_INSTANT_INVITE)) {
			return this.sendReply(message, t('permissions.createInviteCode'));
		}

		// TODO: Eris typescript is missing the 'unique' parameter
		const inv = await channel.createInvite(
			{
				maxAge: 0,
				maxUses: 0,
				temporary: false,
				unique: true
			} as any,
			name
		);

		await channels.insertOrUpdate({
			id: inv.channel.id,
			name: inv.channel.name,
			guildId: guild.id
		});

		await inviteCodes.insertOrUpdate({
			code: inv.code,
			maxAge: 0,
			maxUses: 0,
			temporary: false,
			channelId: inv.channel.id,
			uses: 0,
			guildId: inv.guild.id,
			inviterId: message.author.id,
			clearedAmount: 0
		});

		await this.client.cache.inviteCodes.setOne(
			inv,
			InviteCodeSettingsKey.name,
			name
		);

		this.sendReply(
			message,
			t('cmd.createInvite.done', {
				code: `https://discord.gg/${inv.code}`,
				channel: `<#${channel.id}>`,
				name
			})
		);
	}
}
