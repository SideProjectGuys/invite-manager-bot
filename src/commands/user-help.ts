import { RichEmbed } from 'discord.js';
import { Client, Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { settings, SettingsKeys } from '../sequelize';
import { createEmbed } from '../utils/util';

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
			usage: '<prefix>help (command)'
		});
	}

	@using(resolve('command: Command'))
	public async action(message: Message, [command]: [Command]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		const embed = new RichEmbed();

		const prefix = await this.client.getPrefix(message.guild);

		let description = '';

		if (command) {
			const cmd = {
				...command,
				usage: command.usage.replace('<prefix>', prefix),
			};

			description += `Command: **${cmd.name}**\n\n`;
			description += `\`${cmd.usage}\`\n\n`;
			description += `**Alises**\n`;
			description += `${cmd.aliases}\n\n`;
			description += `**Description**\n`;
			description += `${cmd.desc}\n\n`;
			description += `**Additional Info**\n`;
			description += `${cmd.info}\n\n`;
			description += `**Permissions required by user**\n`;
			description += `${cmd.callerPermissions.length > 0 ? cmd.callerPermissions : 'None'}\n\n`;
			description += `**Permissions required by the bot**\n`;
			description += `${cmd.clientPermissions.length > 0 ? cmd.clientPermissions : 'None'}\n\n`;
		} else {
			let botMember = message.guild.me;

			let commands = this.client.commands
				.filter(c => c.name !== 'groups')
				.filter(c => c.name !== 'shortcuts')
				.filter(c => !c.ownerOnly)
				.filter(c => !c.hidden)
				.map(c => ({
					...c,
					usage: c.usage.replace('<prefix>', prefix),
				}));

			const alertSymbol = '⚠️';

			let publicCommands = commands.filter(c => c.callerPermissions.length === 0);

			description += '**Everyone:**\n\n';
			publicCommands.forEach(c => {
				let missingPermission = c.clientPermissions.find(cp => {
					return !botMember.hasPermission(cp);
				});
				description += `\`${c.usage}\` ${c.desc}${ missingPermission ? alertSymbol + ' _Missing \`' + missingPermission + '\` permission!_\n' : '\n' }`;
			});

			if (message.member.hasPermission('ADMINISTRATOR')) {
				let adminCommands = commands.filter(c => c.callerPermissions.indexOf('ADMINISTRATOR') >= 0);

				description += '\n**Mods only:**\n\n';

				adminCommands.forEach(c => {
					let missingPermission = c.clientPermissions.find(cp => {
						return !botMember.hasPermission(cp);
					});
					description += `\`${c.usage}\` ${c.desc}${ missingPermission ? alertSymbol + ' _Missing \`' + missingPermission + '\` permission!_\n' : '\n' }`;
					});
			}
		}

		embed.setDescription(description);

		embed.addField('Links', `[Support Discord](${config.botSupport}) | ` +
			`[Invite this bot to your server](${config.botAdd}) | [Website](${config.botWebsite})`);

		createEmbed(message.client, embed);

		message.channel.send({ embed });
	}
}
