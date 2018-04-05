import { RichEmbed } from 'discord.js';
import { Client, Command, CommandDecorators, GuildSettings, Logger, logger, Message, Middleware } from 'yamdbf';

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
		const settings: GuildSettings = message.guild.storage.settings;
		const guildPrefix = await settings.get('prefix');

		const embed = new RichEmbed();

		let commands = this.client.commands
			.filter(c => c.name !== 'groups')
			.filter(c => c.name !== 'shortcuts');

		let allCommands = commands.filter(c => !c.ownerOnly);
		allCommands = allCommands.filter(c => !c.hidden);
		allCommands.forEach(c => c.usage = c.usage.replace('<prefix>', guildPrefix));

		let description = '';

		if (command) {
			description += `Command: **${command.name}**\n\n`;
			description += `\`${command.usage}\`\n\n`;
			description += `**Alises**\n`;
			description += `${command.aliases}\n\n`;
			description += `**Description**\n`;
			description += `${command.desc}\n\n`;
			description += `**Additional Info**\n`;
			description += `${command.info}\n\n`;
			description += `**Permissions required by user**\n`;
			description += `${command.callerPermissions.length > 0 ? command.callerPermissions : 'None'}\n\n`;
			description += `**Permissions required by the bot**\n`;
			description += `${command.clientPermissions.length > 0 ? command.clientPermissions : 'None'}\n\n`;
		} else {
			let publicCommands = allCommands.filter(c => c.callerPermissions.length === 0);

			description += '**Everyone:**\n\n';
			publicCommands.forEach(c => {
				description += `\`${c.usage}\` ${c.desc}\n`;
			});

			if (message.member.hasPermission('ADMINISTRATOR')) {
				let adminCommands = allCommands.filter(c => c.callerPermissions.indexOf('ADMINISTRATOR') >= 0);

				description += '\n**Mods only:**\n\n';

				adminCommands.forEach(c => {
					description += `\`${c.usage}\` ${c.desc}\n`;
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
