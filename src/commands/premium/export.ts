import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { MessageAttachment } from 'discord.js';

import { IMClient } from '../../client';
import { generateLeaderboard } from '../../functions/Leaderboard';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import { SettingsCache } from '../../storage/SettingsCache';
import { BotCommand, CommandGroup, RP } from '../../types';

const { resolve, expect, localize } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

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
			group: CommandGroup.Premium,
			hidden: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.export))
	@using(resolve('type: String'))
	@using(expect('type: String'))
	@using(localize)
	public async action(
		message: Message,
		[rp, type]: [RP, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild ? message.guild.name : 'DM'} (${
				message.author.username
			}): ${message.content}`
		);

		const embed = createEmbed(this.client);
		embed.setTitle(`Export`);

		const isPremium = await SettingsCache.isPremium(message.guild.id);
		if (!isPremium) {
			embed.setDescription(rp.CMD_EXPORT_PREMIUM_ONLY());
			return sendReply(message, embed);
		}

		embed.setDescription(rp.CMD_EXPORT_PREPARING());

		if (type !== 'leaderboard') {
			return sendReply(message, rp.CMD_INVALID_TYPE());
		}

		sendReply(message, embed).then(async (msg: Message) => {
			if (type === 'leaderboard') {
				let csv = 'Id,Name,Total Invites,Regular,Custom,Fake,Leaves\n';

				const { keys, invs } = await generateLeaderboard(message.guild);
				keys.forEach(id => {
					const i = invs[id];
					csv +=
						`${i.id},` +
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

				return message.channel.send(attachment).then(() => msg.delete());
			}
		});
	}
}
