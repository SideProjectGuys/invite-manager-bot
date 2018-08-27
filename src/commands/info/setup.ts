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
			title: t('cmd.setup.title'),
			description: t('cmd.setup.text')
		});

		// TODO: Adapt to what the server already has set

		embed.fields.push({
			name: t('cmd.setup.joinLeave.title'),
			value: t('cmd.setup.joinLeave.text')
		});

		embed.fields.push({
			name: t('cmd.setup.prefix.title'),
			value: t('cmd.setup.prefix.text')
		});

		embed.fields.push({
			name: t('cmd.setup.faq.title'),
			value: t('cmd.setup.faq.text')
		});

		embed.fields.push({
			name: t('cmd.setup.help.title'),
			value: t('cmd.setup.help.text', { link: config.botSupport })
		});

		embed.fields.push({
			name: t('cmd.setup.premium.title'),
			value: t('cmd.setup.premium.text', { link: config.botPatreon })
		});

		if (!me.permission.has('MANAGE_GUILD')) {
			embed.fields.push({
				name: t('cmd.setup.manageGuild.title'),
				value: t('cmd.setup.manageGuild.text')
			});
		}

		if (!me.permission.has('MANAGE_ROLES')) {
			embed.fields.push({
				name: t('cmd.setup.manageRoles.title'),
				value: t('cmd.setup.manageRoles.text')
			});
		}

		if (!me.permission.has('VIEW_AUDIT_LOGS')) {
			embed.fields.push({
				name: t('cmd.setup.viewAuditLogs.title'),
				value: t('cmd.setup.viewAuditLogs.text')
			});
		}

		return sendReply(this.client, message, embed);
	}
}
