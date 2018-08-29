import { Message, TextChannel } from 'eris';

import { IMClient } from '../../client';
import { ChannelResolver, StringResolver } from '../../resolvers';
import {
	channels,
	inviteCodes,
	inviteCodeSettings,
	InviteCodeSettingsKey
} from '../../sequelize';
import { BotCommand, CommandGroup, Permissions } from '../../types';
import { Command, Context } from '../Command';

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
		{ guild, t, me }: Context
	): Promise<any> {
		let channel = _channel ? _channel : (message.channel as TextChannel);

		if (!channel.permissionsOf(me.id).has(Permissions.CREATE_INSTANT_INVITE)) {
			return this.client.sendReply(message, t('permissions.createInviteCode'));
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
			inviterId: message.author.id
		});

		await inviteCodeSettings.insertOrUpdate({
			id: null,
			guildId: guild.id,
			inviteCode: inv.code,
			key: InviteCodeSettingsKey.name,
			value: name
		});

		this.client.sendReply(
			message,
			t('cmd.createInvite.done', {
				code: `https://discord.gg/${inv.code}`,
				channel: channel.toString(),
				name
			})
		);
	}
}
