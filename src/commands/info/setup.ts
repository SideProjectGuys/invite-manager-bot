import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { User } from 'discord.js';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import { BotCommand, CommandGroup, RP } from '../../types';

const config = require('../../../config.json');

const { localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'setup',
			aliases: ['guide', 'test', 'testBot', 'test-bot'],
			desc:
				'Help with setting up the bot and ' +
				'checking for problems (e.g. missing permissions)',
			usage: '<prefix>setup',
			group: CommandGroup.Info,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.setup))
	@using(localize)
	public async action(message: Message, [rp, user]: [RP, User]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);
		const botMember = message.guild.me;

		const embed = createEmbed(this.client);

		embed.setTitle(rp.CMD_SETUP_TITLE());

		embed.setDescription(rp.CMD_SETUP_TEXT());

		// TODO: Adapt to what the server already has set

		embed.addField(
			rp.CMD_SETUP_JOINLEAVE_TITLE(),
			rp.CMD_SETUP_JOINLEAVE_TEXT()
		);

		embed.addField(rp.CMD_SETUP_PREFIX_TITLE(), rp.CMD_SETUP_PREFIX_TEXT());

		embed.addField(rp.CMD_SETUP_FAQ_TITLE(), rp.CMD_SETUP_FAQ_TEXT());

		embed.addField(
			rp.CMD_SETUP_HELP_TITLE(),
			rp.CMD_SETUP_HELP_TEXT({ link: config.botSupport })
		);

		embed.addField(
			rp.CMD_SETUP_PREMIUM_TITLE(),
			rp.CMD_SETUP_PREMIUM_TEXT({ link: config.botPatreon })
		);

		embed.addBlankField();

		if (!botMember.hasPermission('MANAGE_GUILD')) {
			embed.addField(
				rp.CMD_SETUP_MANAGE_GUILD_TITLE(),
				rp.CMD_SETUP_MANAGE_GUILD_TEXT()
			);
		}

		if (!botMember.hasPermission('MANAGE_ROLES')) {
			embed.addField(
				rp.CMD_SETUP_MANAGE_ROLES_TITLE(),
				rp.CMD_SETUP_MANAGE_ROLES_TEXT()
			);
		}

		return sendReply(message, embed);
	}
}
