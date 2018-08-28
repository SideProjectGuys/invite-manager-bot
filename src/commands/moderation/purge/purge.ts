import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { GuildMember } from 'discord.js';

import { IMClient } from '../../../client';
import { createEmbed, sendReply } from '../../../functions/Messaging';
import { checkProBot, checkRoles } from '../../../middleware';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	inviteCodes,
	joins,
	sequelize
} from '../../../sequelize';
import { CommandGroup, ModerationCommand, RP } from '../../../types';
import { to } from '../../../util';

const { localize, resolve, expect } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'purge',
			aliases: ['prune'],
			desc: 'Remove fake invites from all users',
			usage: '<prefix>purge <number> <user>',
			clientPermissions: ['MANAGE_MESSAGES'],
			group: CommandGroup.Moderation,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(ModerationCommand.purge))
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
		let [error, _] = await to(message.channel.bulkDelete(messages));
		if (error) {
			embed.setTitle('Error');
			embed.setDescription(error);
		} else {
			embed.setTitle('Deleted Messages');
			embed.setDescription(`Deleted **${messages.length}** messages.\nThis message will be deleted in 5 seconds.`);
		}

		let response = await sendReply(message, embed) as Message;

		setTimeout(
			() => {
				response.delete();
			},
			5000);
	}
}
