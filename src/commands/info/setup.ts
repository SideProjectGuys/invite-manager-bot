import { Message } from 'eris';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';

const config = require('../../../config.json');

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.setup,
			aliases: ['guide', 'test', 'testBot', 'test-bot'],
			desc:
				'Help with setting up the bot and ' +
				'checking for problems (e.g. missing permissions)',
			group: CommandGroup.Info,
			strict: true,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		{ t, me }: Context
	): Promise<any> {
		const embed = createEmbed(this.client, {
			title: t('CMD_SETUP_TITLE'),
			description: t('CMD_SETUP_TEXT')
		});

		// TODO: Adapt to what the server already has set

		embed.fields.push({
			name: t('CMD_SETUP_JOINLEAVE_TITLE'),
			value: t('CMD_SETUP_JOINLEAVE_TEXT')
		});

		embed.fields.push({
			name: t('CMD_SETUP_PREFIX_TITLE'),
			value: t('CMD_SETUP_PREFIX_TEXT')
		});

		embed.fields.push({
			name: t('CMD_SETUP_FAQ_TITLE'),
			value: t('CMD_SETUP_FAQ_TEXT')
		});

		embed.fields.push({
			name: t('CMD_SETUP_HELP_TITLE'),
			value: t('CMD_SETUP_HELP_TEXT', { link: config.botSupport })
		});

		embed.fields.push({
			name: t('CMD_SETUP_PREMIUM_TITLE'),
			value: t('CMD_SETUP_PREMIUM_TEXT', { link: config.botPatreon })
		});

		if (!me.permission.has('MANAGE_GUILD')) {
			embed.fields.push({
				name: t('CMD_SETUP_MANAGE_GUILD_TITLE'),
				value: t('CMD_SETUP_MANAGE_GUILD_TEXT')
			});
		}

		if (!me.permission.has('MANAGE_ROLES')) {
			embed.fields.push({
				name: t('CMD_SETUP_MANAGE_ROLES_TITLE'),
				value: t('CMD_SETUP_MANAGE_ROLES_TEXT')
			});
		}

		return sendReply(this.client, message, embed);
	}
}
