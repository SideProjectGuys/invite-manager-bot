import { RichEmbed, User } from 'discord.js';
import { Command, Logger, logger, Message } from 'yamdbf';

import { IMClient } from '../client';
import { CommandGroup, createEmbed, sendEmbed } from '../utils/util';

const config = require('../../config.json');

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'setup',
			aliases: ['guide', 'diagnose', 'diag', 'test', 'testBot', 'test-bot'],
			desc:
				'Help with setting up the bot and ' +
				'checking for problems (e.g. missing permissions)',
			usage: '<prefix>setup',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Admin,
			guildOnly: true
		});
	}

	public async action(message: Message, [user]: [User]): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);
		const botMember = message.guild.me;

		const embed = createEmbed(this.client);

		embed.setTitle('Setting up InviteManager');

		embed.setDescription(
			'After inviting the bot, all invites will be tracked automatically.'
		);

		// TODO: Adapt to what the server already has set

		embed.addField(
			'Setting join and leave message channel',
			'If you want to display join and or leave messages in one of your channels, ' +
				'you have to configure that channel by doing `!config joinMessageChannel #channel`' +
				'or `!config leaveMessageChannel #channel`. Make sure the bot has write permissions in those channels!\n\n'
		);

		embed.addField(
			'Changing the prefix',
			'You can change the prefix by doing `!config prefix !`.\n\n' +
				"If you don't know the bots prefix, you can find it using `@InviteManager config prefix`."
		);

		embed.addField(
			'FAQs and more',
			'Use the `!faq` command for more info, eg. how to change the prefix or customize the join/leave messages.\n\n' +
				'A complete guide on setting up the bot can be found here: ' +
				'https://github.com/AndreasGassmann/discord-invite-manager/'
		);

		embed.addField(
			'Help',
			'If you need help or have feedback, you can either use the `!feedback` command' +
				' or join our discord support server: ' +
				config.botSupport
		);

		embed.addField(
			'Premium',
			'If you would like to support the development of this bot, you can do so by supporting us on Patreon: ' +
				config.botPatreon +
				'\n\n' +
				'Depending on the tier, you will get some additional features.'
		);

		embed.addBlankField();

		if (!botMember.hasPermission('MANAGE_GUILD')) {
			embed.addField(
				'Missing permission: Manage Server',
				'The bot does not have the "Manage Server" permissions. ' +
					'This permission is required to read the invites of the user. Without this permission the join messages.'
			);
		}

		if (!botMember.hasPermission('MANAGE_ROLES')) {
			embed.addField(
				'Missing permission: Manage Roles',
				'The bot does not have the "Manage Roles" permissions. ' +
					'This permission is required to assign roles to a user. Without this permission members cannot be auto-promoted.'
			);
		}

		sendEmbed(message.channel, embed, message.author);
	}
}
