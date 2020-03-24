import { Message } from 'eris';

import { IMClient } from '../../../client';
import { BotCommand, CommandGroup, GuildPermission } from '../../../types';
import { CommandResolver } from '../../resolvers';
import { Command, Context } from '../Command';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.help,
			aliases: [],
			args: [
				{
					name: 'command',
					resolver: CommandResolver
				}
			],
			group: CommandGroup.Info,
			guildOnly: false,
			defaultAdminOnly: false,
			extraExamples: ['!help addRank']
		});
	}

	public async action(message: Message, [command]: [Command], flags: {}, context: Context): Promise<any> {
		const { guild, t, settings, me } = context;
		const embed = this.createEmbed();

		const prefix = settings ? settings.prefix : '!';

		if (command) {
			const cmd = {
				...command,
				usage: command.usage.replace('{prefix}', prefix),
				info: command.getInfo(context).substr(0, 900)
			};

			embed.fields.push({
				name: t('cmd.help.command.title'),
				value: cmd.name,
				inline: true
			});
			embed.fields.push({
				name: t('cmd.help.description.title'),
				value: t(`cmd.${cmd.name}.self.description`),
				inline: true
			});
			embed.fields.push({
				name: t('cmd.help.usage.title'),
				value: '`' + cmd.usage + '`\n\n' + cmd.info
			});
			if (cmd.aliases.length > 0) {
				embed.fields.push({
					name: t('cmd.help.aliases.title'),
					value: cmd.aliases.join(', '),
					inline: true
				});
			}
		} else {
			embed.description = t('cmd.help.text', { prefix }) + '\n\n';

			const commands = this.client.cmds.commands
				.map((c) => ({
					...c,
					usage: c.usage.replace('{prefix}', prefix)
				}))
				.sort((a, b) => a.name.localeCompare(b.name));

			Object.keys(CommandGroup).forEach((group) => {
				const cmds = commands.filter((c) => c.group === group);
				if (cmds.length === 0) {
					return;
				}

				let descr = '';
				descr += cmds.map((c) => '`' + c.name + '`').join(', ');
				embed.fields.push({ name: group, value: descr });
			});

			if (guild) {
				let member = guild.members.get(message.author.id);
				if (!member) {
					member = await guild.getRESTMember(message.author.id);
				}

				if (member && member.permission.has(GuildPermission.ADMINISTRATOR)) {
					const missing: string[] = [];
					if (!me.permission.has(GuildPermission.MANAGE_GUILD)) {
						missing.push(t('permissions.manageGuild'));
					}
					if (!me.permission.has(GuildPermission.VIEW_AUDIT_LOGS)) {
						missing.push(t('permissions.viewAuditLogs'));
					}
					if (!me.permission.has(GuildPermission.MANAGE_ROLES)) {
						missing.push(t('permissions.manageRoles'));
					}

					if (missing.length > 0) {
						embed.fields.push({
							name: t('cmd.help.missingPermissions'),
							value: missing.map((p) => `\`${p}\``).join(', ')
						});
					}
				}
			}
		}

		const linksArray = [];
		if (this.client.config.bot.links.support) {
			linksArray.push(`[${t('bot.supportDiscord.title')}](${this.client.config.bot.links.support})`);
		}
		if (this.client.config.bot.links.add) {
			linksArray.push(`[${t('bot.invite.title')}](${this.client.config.bot.links.add})`);
		}
		if (this.client.config.bot.links.website) {
			linksArray.push(`[${t('bot.website.title')}](${this.client.config.bot.links.website})`);
		}
		if (this.client.config.bot.links.patreon) {
			linksArray.push(`[${t('bot.patreon.title')}](${this.client.config.bot.links.patreon})`);
		}

		embed.fields.push({
			name: t('cmd.help.links'),
			value: linksArray.join(` | `)
		});

		await this.sendReply(message, embed);
	}
}
