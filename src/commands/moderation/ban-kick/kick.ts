import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { GuildMember, User } from 'discord.js';

import { IMClient } from '../../../client';
import { createEmbed, sendEmbed, sendReply } from '../../../functions/Messaging';
import { checkProBot, checkRoles } from '../../../middleware';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	sequelize
} from '../../../sequelize';
import { BotCommand, CommandGroup, ModerationCommand, RP } from '../../../types';

const { localize, resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'kick',
			aliases: [],
			desc: 'Remove fake invites from all users',
			usage: '<prefix>ban <user> <limit> <reason>',
			clientPermissions: ['BAN_MEMBERS'],
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(ModerationCommand.kick))
	@using(resolve('user: Member, limit: Number, reason: String'))
	@using(expect('user: Member'))
	@using(localize)
	public async action(
		message: Message,
		[rp, user, limit, reason]: [RP, GuildMember, number, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		if (this.client.config.ownerGuildIds.indexOf(message.guild.id) === -1) {
			return;
		}

		const embed = createEmbed(this.client);

		embed.setDescription(`Not implemented yet.`);
		sendReply(message, embed);
	}
}
