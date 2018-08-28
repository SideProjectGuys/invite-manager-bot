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
	sequelize,
	strikeConfigs,
	ViolationType
} from '../../../sequelize';
import { BotCommand, CommandGroup, ModerationCommand, RP } from '../../../types';

const { localize, resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'strike-config',
			aliases: [],
			desc: 'Remove fake invites from all users',
			usage: '<prefix>strike-config <violation> <strikes>',
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(ModerationCommand.strikeConfig))
	@using(resolve('violation: String, strikes: Number'))
	@using(expect('violation: String'))
	@using(localize)
	public async action(
		message: Message,
		[rp, violation, strikes = 0]: [RP, String, number]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		if (this.client.config.ownerGuildIds.indexOf(message.guild.id) === -1) {
			return;
		}

		if (!Object.values(ViolationType).includes(violation)) {
			return message.channel.send(
				`This is not a valid type. Please use one of the following\n` +
				`${Object.values(ViolationType).map(v => `\`${v}\``).join(', ')}`);
		}

		strikeConfigs.insertOrUpdate({
			id: null,
			guildId: message.guild.id,
			violationType: violation as ViolationType,
			amount: strikes
		});

		const embed = createEmbed(this.client);

		embed.setDescription(`Not implemented yet.`);
		sendReply(message, embed);
	}
}
