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
			name: 'purge-safe',
			aliases: ['prune-safe'],
			desc: 'Remove fake invites from all users',
			usage: '<prefix>purge <number> <user>',
			clientPermissions: ['MANAGE_MESSAGES'],
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(ModerationCommand.purgeSafe))
	@using(resolve('quantity: number, member: Member'))
	@using(expect('quantity: number'))
	@using(localize)
	public async action(
		message: Message,
		[rp, quantity, member]: [RP, number, GuildMember]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		if (this.client.config.ownerGuildIds.indexOf(message.guild.id) === -1) {
			return;
		}

		const embed = createEmbed(this.client);

		if (!quantity || quantity < 1) {
			return message.channel.send('You must enter a number of messages to purge.');
		}

		let messages: Message[];
		if (member) {
			messages = (await message.channel.messages.fetch(
				{ limit: Math.min(quantity, 100), before: message.id }))
				.filter((a: Message) => a.author.id === member.id)
				.array();
		} else {
			messages = (await message.channel.messages.fetch(
				{ limit: Math.min(quantity, 100), before: message.id }))
				.array();
		}

		message.delete();
		await message.channel.bulkDelete(messages);

		embed.setTitle('Deleted Messages');
		embed.setDescription(`Deleted **${messages.length}** messages.\nThis message will be deleted in 5 seconds.`);

		let response: Message = await sendReply(message, embed) as Message;
		setTimeout(
			() => {
				response.delete();
			},
			5000);
	}
}
