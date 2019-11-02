import { Message } from 'eris';

import { IMClient } from '../../../client';
import { BotCommand, CommandGroup, GuildPermission } from '../../../types';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.setup,
			aliases: ['guide', 'test', 'testBot', 'test-bot'],
			group: CommandGroup.Info,
			guildOnly: true,
			defaultAdminOnly: true
		});
	}

	public async action(message: Message, args: any[], flags: {}, { t, me }: Context): Promise<any> {
		const embed = this.createEmbed({
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
			value: t('cmd.setup.help.text', {
				link: this.client.config.bot.links.support
			})
		});

		embed.fields.push({
			name: t('cmd.setup.premium.title'),
			value: t('cmd.setup.premium.text', {
				link: this.client.config.bot.links.patreon
			})
		});

		if (!me.permission.has(GuildPermission.MANAGE_GUILD)) {
			embed.fields.push({
				name: t('cmd.setup.manageGuild.title'),
				value: t('cmd.setup.manageGuild.text')
			});
		}

		if (!me.permission.has(GuildPermission.MANAGE_ROLES)) {
			embed.fields.push({
				name: t('cmd.setup.manageRoles.title'),
				value: t('cmd.setup.manageRoles.text')
			});
		}

		if (!me.permission.has(GuildPermission.VIEW_AUDIT_LOGS)) {
			embed.fields.push({
				name: t('cmd.setup.viewAuditLogs.title'),
				value: t('cmd.setup.viewAuditLogs.text')
			});
		}

		return this.sendReply(message, embed);
	}
}
