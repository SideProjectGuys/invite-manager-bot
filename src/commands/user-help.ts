import { RichEmbed } from 'discord.js';
import { Client, Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { settings, SettingsKeys } from '../sequelize';
import { CommandGroup, createEmbed } from '../utils/util';

const { resolve } = Middleware;
const { using } = CommandDecorators;

const config = require('../../config.json');

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'help',
			desc: 'Display help',
			usage: '<prefix>help (command)',
			guildOnly: true,
		});
	}

	@using(resolve('command: Command'))
	public async action(message: Message, [command]: [Command]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		const embed = new RichEmbed();

		const prefix = await this.client.getPrefix(message.guild);

		if (command) {
			const cmd = {
				...command,
				usage: command.usage.replace('<prefix>', prefix),
			};

			let description = '';
			description += `**Usage**\n`;
			description += `\`${cmd.usage}\`\n\n`;
			description += `${cmd.info}\n\n`;
			description += `**Alises**\n`;
			description += `${cmd.aliases}\n\n`;
			description += `**Description**\n`;
			description += `${cmd.desc}\n\n`;
			description += `**Permissions required by user**\n`;
			description += `${cmd.callerPermissions.length > 0 ? cmd.callerPermissions : 'None'}\n\n`;
			description += `**Permissions required by the bot**\n`;
			description += `${cmd.clientPermissions.length > 0 ? cmd.clientPermissions : 'None'}\n\n`;

			embed.addField(`Command: **${cmd.name}**`, description);

		} else {
			embed.setDescription('This is a list of commands you can use. You can get more info about a specific ' +
				`command by using \`${prefix}help <command>\` (e.g. \`${prefix}help add-ranks\`)\n\n` +
				`Arguments are listed after the command. Parentheses \`()\` indicate an **optional** argument. ` +
				`(e.g. \`(reason)\` means the \`reason\` is optional)\n\n`);

			const commands = this.client.commands
				.filter(c => c.name !== 'groups')
				.filter(c => c.name !== 'shortcuts')
				.filter(c => !c.ownerOnly && !c.hidden)
				.filter(c => message.member.hasPermission(c.callerPermissions))
				.map(c => ({
					...c,
					usage: c.usage.replace('<prefix>', prefix),
				}))
				.sort((a, b) => a.name.localeCompare(b.name));

			Object.keys(CommandGroup).forEach(group => {
				const cmds = commands.filter(c => c.group === group);
				if (cmds.length === 0) {
					return;
				}

				let descr = '';
				const len = cmds.reduce((acc, c) => Math.max(acc, c.usage.length), 0);
				cmds.forEach(c => descr += `\`${c.usage}  ${' '.repeat(len - c.usage.length)}${c.desc}\`\n`);
				embed.addField(group, descr);
			});

			if (message.member.hasPermission('ADMINISTRATOR')) {
				const botMember = message.guild.me;
				const unavailableCommands = commands.filter(c => !botMember.hasPermission(c.clientPermissions));

				if (unavailableCommands.length > 0) {
					const alertSymbol = '⚠️';

					let unavailableDescription = '';
					unavailableCommands.forEach(c => {
						let missingPermission = c.clientPermissions.find(cp => {
							return !botMember.hasPermission(cp);
						});
						unavailableDescription +=
							`\`${prefix}${c.name}\`  ${alertSymbol} *Missing \`${missingPermission}\` permission!*\n`;
					});
					embed.addField(`Unavailable commands (missing permissions)`, unavailableDescription);
				}
			}
		}

		embed.addField('Links', `[Support Discord](${config.botSupport}) | ` +
			`[Invite this bot to your server](${config.botAdd}) | [Website](${config.botWebsite})`);

		createEmbed(message.client, embed);

		message.channel.send({ embed });
	}
}
