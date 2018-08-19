import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { checkProBot } from '../../middleware';
import { CommandGroup, RP } from '../../types';

const { resolve, localize } = Middleware;
const { using } = CommandDecorators;

const config = require('../../../config.json');

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'help',
			desc: 'Display help',
			usage: '<prefix>help (command)'
		});
	}

	@using(checkProBot)
	@using(resolve('command: Command'))
	@using(localize)
	public async action(
		message: Message,
		[rp, command]: [RP, Command]
	): Promise<any> {
		this._logger.log(
			`${message.guild ? message.guild.name : 'DM'} (${
				message.author.username
			}): ${message.content}`
		);

		const embed = createEmbed(this.client);

		const prefix = message.guild
			? await this.client.getPrefix(message.guild)
			: '!';

		if (command) {
			const cmd = {
				...command,
				usage: command.usage.replace('<prefix>', prefix)
			};

			embed.addField(rp.CMD_HELP_COMMAND_TITLE(), cmd.name, true);
			embed.addField(rp.CMD_HELP_DESCRIPTION_TITLE(), cmd.desc, true);
			embed.addField(
				rp.CMD_HELP_USAGE_TITLE(),
				'`' + cmd.usage + '`' + (cmd.info ? '\n\n' + cmd.info : '')
			);
			if (cmd.aliases.length > 0) {
				embed.addField(
					rp.CMD_HELP_ALIASES_TITLE(),
					cmd.aliases.join(', '),
					true
				);
			}
			embed.addField(
				rp.CMD_HELP_BOT_PERMISSIONS_TITLE(),
				cmd.clientPermissions.length > 0
					? cmd.clientPermissions.join(', ')
					: rp.CMD_HELP_COMMAND_NONE(),
				true
			);
		} else {
			const messageMember = await message.guild.members
				.fetch(message.author.id)
				.catch(() => undefined);

			embed.setDescription(rp.CMD_HELP_TEXT({ prefix }) + '\n\n');

			const commands = this.client.commands
				.filter(c => c.name !== 'groups')
				.filter(c => c.name !== 'shortcuts')
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
				const len = cmds.reduce((acc, c) => Math.max(acc, c.usage.length), 0);
				descr += cmds.map(c => '`' + c.name + '`').join(', ');
				embed.addField(group, descr);
			});

			if (
				message.guild &&
				messageMember &&
				messageMember.hasPermission('ADMINISTRATOR')
			) {
				const botMember = message.guild.me;
				const unavailableCommands = commands.filter(
					c => !botMember.hasPermission(c.clientPermissions)
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
					embed.addField(
						rp.CMD_HELP_UNAVAILABLE_COMMAND_TITLE(),
						unavailableDescription
					);
				}
			}
		}

		let linksArray = [];
		if (config.botSupport) {
			linksArray.push(
				`[${rp.BOT_SUPPORT_DISCORD_TITLE()}](${config.botSupport})`
			);
		}
		if (config.botAdd) {
			linksArray.push(`[${rp.BOT_INVITE_TITLE()}](${config.botAdd})`);
		}
		if (config.botWebsite) {
			linksArray.push(`[${rp.BOT_WEBSITE_TITLE()}](${config.botWebsite})`);
		}
		if (config.botPatreon) {
			linksArray.push(`[${rp.BOT_PATREON_TITLE()}](${config.botPatreon})`);
		}

		embed.addField(rp.CMD_HELP_LINKS(), linksArray.join(` | `));

		return sendReply(message, embed);
	}
}
