import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { TextChannel } from 'discord.js';

import { IMClient } from '../../client';
import { sendReply } from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import {
	inviteCodes,
	inviteCodeSettings,
	InviteCodeSettingsKey
} from '../../sequelize';
import { BotCommand, CommandGroup, RP } from '../../types';

const { resolve, expect, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'create-invite',
			aliases: ['createInvite'],
			desc: 'Creates unique invite codes',
			usage: '<prefix>create-invite name',
			info: '`name`:\n' + 'The name of the invite code.\n\n',
			group: CommandGroup.Invites,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.createInvite))
	@using(resolve('name: String, channel: Channel'))
	@using(expect('name: String'))
	@using(localize)
	public async action(
		message: Message,
		[rp, name, _channel]: [RP, string, TextChannel]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		let channel = _channel ? _channel : (message.channel as TextChannel);

		if (
			!channel.permissionsFor(message.guild.me).has('CREATE_INSTANT_INVITE')
		) {
			return sendReply(message, rp.CMD_CREATEINVITE_MISSING_PERMISSIONS());
		}

		const inv = await channel.createInvite({
			maxAge: 0,
			maxUses: 0,
			reason: name,
			temporary: false,
			unique: true
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
			guildId: message.guild.id,
			inviteCode: inv.code,
			key: InviteCodeSettingsKey.name,
			value: name
		});

		sendReply(
			message,
			rp.CMD_CREATEINVITE_DONE({
				code: `https://discord.gg/${inv.code}`,
				channel: channel.toString(),
				name
			})
		);
	}
}
