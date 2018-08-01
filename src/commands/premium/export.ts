import {
	Client,
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { MessageAttachment } from 'discord.js';

import { SettingsCache } from '../../utils/SettingsCache';
import {
	CommandGroup,
	createEmbed,
	generateLeaderboard,
	sendEmbed
} from '../../utils/util';

const { resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<Client> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'export',
			aliases: [],
			desc: 'Export data of invite manager to a csv sheet',
			usage: '<prefix>export type',
			info:
				'`type`:\n' +
				'The type of export you want. One of:\n' +
				'- leaderboard',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Premium,
			hidden: true
		});
	}

	@using(resolve('type: String'))
	@using(expect('type: String'))
	public async action(message: Message, [type]: [string]): Promise<any> {
		this._logger.log(
			`${message.guild ? message.guild.name : 'DM'} (${
				message.author.username
			}): ${message.content}`
		);

		const embed = createEmbed(this.client);
		embed.setTitle(`Export`);

		const isPremium = await SettingsCache.isPremium(message.guild.id);
		if (!isPremium) {
			embed.setDescription(
				`This command is only available for premium subscribers!`
			);
			sendEmbed(message.channel, embed, message.author);
			return;
		}

		embed.setDescription(`Please wait while we prepare the file...`);

		if (type !== 'leaderboard') {
			message.channel.send('Invalid export type. Use one of: `leaderboard`');
			return;
		}

		sendEmbed(message.channel, embed, message.author).then(
			async (msg: Message) => {
				if (type === 'leaderboard') {
					let csv = 'Name,Total Invites,Regular,Custom,Fake,Leaves\n';

					const { keys, invs } = await generateLeaderboard(message.guild);
					keys.forEach(id => {
						const i = invs[id];
						csv +=
							`"${i.name.replace(/"/g, '\\"')}",` +
							`${i.total},` +
							`${i.regular},` +
							`${i.custom},` +
							`${i.fake},` +
							`${i.leaves},` +
							`\n`;
					});

					const attachment = new MessageAttachment(
						Buffer.from(csv),
						'InviteManagerExport.csv'
					);

					message.channel.send(attachment).then(() => msg.delete());
				}
			}
		);
	}
}
