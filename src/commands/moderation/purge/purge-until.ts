import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { Collection, GuildMember, User } from 'discord.js';

import { IMClient } from '../../../client';
import { createEmbed, sendEmbed, sendReply } from '../../../functions/Messaging';
import { checkProBot, checkRoles } from '../../../middleware';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	sequelize
} from '../../../sequelize';
import { BotCommand, CommandGroup, ModerationCommand, RP } from '../../../types';

const { localize, resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'purge-until',
			aliases: ['prune-until', 'pruneu', 'purgeu'],
			desc: 'Remove fake invites from all users',
			usage: '<prefix>purge-until <messageID>',
			clientPermissions: ['MANAGE_MESSAGES'],
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(ModerationCommand.purgeUntil))
	@using(resolve('untilMessageID: string'))
	@using(expect('untilMessageID: string'))
	@using(localize)
	public async action(
		message: Message,
		[rp, untilMessageID]: [RP, string]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		if (this.client.config.ownerGuildIds.indexOf(message.guild.id) === -1) {
			return;
		}

		const embed = createEmbed(this.client);

		let messages: Message[] = (await message.channel.messages.fetch(
			{ limit: 100, before: message.id }))
			.filter((m: Message) => m.id >= untilMessageID)
			.array();

		embed.setTitle('Delete Messages');

		if (messages.length === 0) {
			embed.setDescription(`No messages found to delete.`);
			return sendReply(message, embed);
		} else if (messages.length > 100) {
			embed.setDescription(`Could not find messageID in the last 100 messages.`);
			return sendReply(message, embed);
		} else {
			message.delete();
			await message.channel.bulkDelete(messages);

			embed.setDescription(`Deleted **${messages.length}** messages.\nThis message will be deleted in 5 seconds.`);

			let response: Message = await sendReply(message, embed) as Message;
			setTimeout(
				() => {
					response.delete();
				},
				5000);
		}
	}
}
