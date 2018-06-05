import { RichEmbed } from 'discord.js';
import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from 'yamdbf';

import { IMClient } from '../client';
import { settings, SettingsKey } from '../sequelize';
import { CommandGroup, createEmbed, sendEmbed } from '../utils/util';

const { resolve } = Middleware;
const { using } = CommandDecorators;

const config = require('../../config.json');

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'help',
			desc: 'Display help',
			usage: '<prefix>help (command)'
		});
	}

	@using(resolve('command: Command'))
	public async action(message: Message, [command]: [Command]): Promise<any> {
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

			embed.addField('Command', cmd.name, true);
			embed.addField('Description', cmd.desc, true);
			embed.addField(
				'Usage',
				'`' + cmd.usage + '`' + (cmd.info ? '\n\n' + cmd.info : '')
			);
			if (cmd.aliases.length > 0) {
				embed.addField('Aliases', cmd.aliases.join(', '), true);
			}
			embed.addField(
				'Bot permissions',
				cmd.clientPermissions.length > 0
					? cmd.clientPermissions.join(', ')
					: 'None',
				true
			);
			embed.addField(
				'User permissions',
				cmd.callerPermissions.length > 0
					? cmd.callerPermissions.join(', ')
					: 'None',
				true
			);
		} else {
			let messageMember = message.member;
			if (message.guild && !messageMember) {
				this._logger.log(
					`INFO: ${message.guild.name} (${message.author.username}): ${
						message.content
					} HAS NO MEMBER`
				);
				messageMember = await message.guild.fetchMember(message.author.id);
			}

			embed.setDescription(
				'This is a list of commands you can use. You can get more info about a specific ' +
					`command by using \`${prefix}help <command>\` (e.g. \`${prefix}help add-ranks\`)\n\n` +
					`Arguments are listed after the command. Parentheses \`()\` indicate an **optional** argument. ` +
					`(e.g. \`(reason)\` means the \`reason\` is optional)\n\n`
			);

			const commands = this.client.commands
				.filter(c => c.name !== 'groups')
				.filter(c => c.name !== 'shortcuts')
				.filter(c => !c.ownerOnly && !c.hidden)
				.filter(
					c =>
						!message.guild || messageMember.hasPermission(c.callerPermissions)
				)
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
				/*cmds.forEach(c => embed.addField(c.name, c.desc));
				cmds.forEach(
					c =>
						(descr += `\`${c.usage}  ${' '.repeat(len - c.usage.length)}${
							c.desc
						}\`\n`)
				);*/
				embed.addField(group, descr);
			});

			if (message.guild && messageMember.hasPermission('ADMINISTRATOR')) {
				const botMember = message.guild.me;
				const unavailableCommands = commands.filter(
					c => !botMember.hasPermission(c.clientPermissions)
				);

				if (unavailableCommands.length > 0) {
					const alertSymbol = '⚠️';

					let unavailableDescription = '';
					unavailableCommands.forEach(c => {
						let missingPermission = c.clientPermissions.find(cp => {
							return !botMember.hasPermission(cp);
						});
						unavailableDescription += `\`${prefix}${
							c.name
						}\`  ${alertSymbol} *Missing \`${missingPermission}\` permission!*\n`;
					});
					embed.addField(
						`Unavailable commands (missing permissions)`,
						unavailableDescription
					);
				}
			}
		}

		let linksArray = [];
		if (config.botSupport) {
			linksArray.push(`[Support Discord](${config.botSupport})`);
		}
		if (config.botAdd) {
			linksArray.push(`[Invite this bot to your server](${config.botAdd})`);
		}
		if (config.botWebsite) {
			linksArray.push(`[Website](${config.botWebsite})`);
		}
		if (config.botPatreon) {
			linksArray.push(`[Patreon](${config.botPatreon})`);
		}

		embed.addField('Links', linksArray.join(` | `));

		sendEmbed(message.channel, embed, message.author);
	}
}
