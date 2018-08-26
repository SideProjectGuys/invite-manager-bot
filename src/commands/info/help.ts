import { Message } from 'eris';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { BotCommand, CommandGroup } from '../../types';
import { Command, Context } from '../Command';
import { CommandResolver } from '../resolvers/CommandResolver';

const config = require('../../../config.json');

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: BotCommand.help,
			aliases: [],
			args: [
				{
					name: 'command',
					description: 'The command to get detailed information for',
					resolver: CommandResolver
				}
			],
			desc: 'Display help',
			group: CommandGroup.Info,
			guildOnly: false
		});
	}

	public async action(
		message: Message,
		[command]: [Command],
		{ guild, t, settings, me }: Context
	): Promise<any> {
		const embed = createEmbed(this.client);

		const prefix = settings ? settings.prefix : '!';

		if (command) {
			const cmd = {
				...command,
				usage: command.usage.replace('<prefix>', prefix)
			};

			embed.fields.push({
				name: t('CMD_HELP_COMMAND_TITLE'),
				value: cmd.name,
				inline: true
			});
			embed.fields.push({
				name: t('CMD_HELP_DESCRIPTION_TITLE'),
				value: cmd.description,
				inline: true
			});
			embed.fields.push({
				name: t('CMD_HELP_USAGE_TITLE'),
				value: '`' + cmd.usage + '`' + (cmd.info ? '\n\n' + cmd.info : '')
			});
			if (cmd.aliases.length > 0) {
				embed.fields.push({
					name: t('CMD_HELP_ALIASES_TITLE'),
					value: cmd.aliases.join(', '),
					inline: true
				});
			}
		} else {
			let member = guild.members.get(message.author.id);
			if (!member) {
				member = await guild.getRESTMember(message.author.id);
			}

			embed.description = t('CMD_HELP_TEXT', { prefix }) + '\n\n';

			const commands = this.client.commands
				.filter(c => !c.ownerOnly && !c.hidden)
				.map(c => ({
					...c,
					usage: c.usage.replace('<prefix>', prefix)
				}))
				.sort((a, b) => a.name.localeCompare(b.name));

			Object.keys(CommandGroup).forEach(group => {
				const cmds = commands.filter(c => c.group === group);
				if (cmds.length === 0) {
					return;
				}

				let descr = '';
				descr += cmds.map(c => '`' + c.name + '`').join(', ');
				embed.fields.push({ name: group, value: descr });
			});

			/*if (guild && member && member.permission.has('ADMINISTRATOR')) {
				const unavailableCommands = commands.filter(
					c => !me.permission.has(c.clientPermissions)
				);

				if (unavailableCommands.length > 0) {
					let unavailableDescription = '';
					unavailableCommands.forEach(c => {
						const missingPermission = c.clientPermissions.find(cp => {
							return !botMember.hasPermission(cp);
						});
						unavailableDescription +=
							rp.CMD_HELP_UNAVAILABLE_COMMAND({
								prefix,
								name: c.name,
								missingPermission
							}) + '\n';
					});
					embed.fields.push(
						t('CMD_HELP_UNAVAILABLE_COMMAND_TITLE'),
						unavailableDescription
					);
				}
			}*/
		}

		let linksArray = [];
		if (config.botSupport) {
			linksArray.push(
				`[${t('BOT_SUPPORT_DISCORD_TITLE')}](${config.botSupport})`
			);
		}
		if (config.botAdd) {
			linksArray.push(`[${t('BOT_INVITE_TITLE')}](${config.botAdd})`);
		}
		if (config.botWebsite) {
			linksArray.push(`[${t('BOT_WEBSITE_TITLE')}](${config.botWebsite})`);
		}
		if (config.botPatreon) {
			linksArray.push(`[${t('BOT_PATREON_TITLE')}](${config.botPatreon})`);
		}

		embed.fields.push({
			name: t('CMD_HELP_LINKS'),
			value: linksArray.join(` | `)
		});

		return sendReply(this.client, message, embed);
	}
}
