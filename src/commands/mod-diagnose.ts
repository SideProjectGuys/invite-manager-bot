import { RichEmbed, User } from 'discord.js';
import { Client, Command, Logger, logger, Message } from 'yamdbf';

import { CommandGroup, createEmbed } from '../utils/util';

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'diagnose',
			aliases: ['guide', 'setup', 'diag', 'test', 'testBot', 'test-bot'],
			desc: 'Check for problems (e.g. missing permissions)',
			usage: '<prefix>diagnose',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Admin,
			guildOnly: true
		});
	}

	public async action(message: Message, [user]: [User]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);
		let botMember = message.guild.me;

		const embed = new RichEmbed();
		embed.setTitle('This command shows a list of common errors in case your bot is not working properly.');
		let embedText = '';
		if (message.guild.embedEnabled === undefined) {
			embedText = 'Unknown if embeds are enabled. If you can\'t see the bot responses, ' +
				'please make sure to enable rich embeds in your settings.';
		} else if (!message.guild.embedEnabled) {
			embedText = 'Embeds are disabled. You will most likely not see the bot responses. ' +
				'Please enable rich embeds in your settings.';
		}
		if (embedText) {
			embed.addField('Rich Embeds', embedText);
		}

		// TODO: Show affected commands
		if (!botMember.hasPermission('MANAGE_GUILD')) {
			embed.addField(
				'Permission missing: Manage Server',
				'The bot does not have the "Manage Server" permissions. ' +
				'This permission is required to read the invites of the user. Without this permission the join messages.'
			);
		}

		if (!botMember.hasPermission('MANAGE_ROLES')) {
			embed.addField(
				'Permission missing: Manage Roles',
				'The bot does not have the "Manage Roles" permissions. ' +
				'This permission is required to assign roles to a user. Without this permission members cannot be auto-promoted.'
			);
		}

		// TODO: Send message to us with info
		createEmbed(message.client, embed);
		message.channel.send({ embed }).catch((e) => {
			embed.addField(
				'Permission missing: Send to channel',
				'The bot was not able to send a message to the server where you executed the `diagnose` command. ' +
				'Please check the bots permissions (do you have embeds enabled?)'
			);
			message.author.send({ embed });
		});
	}
}
