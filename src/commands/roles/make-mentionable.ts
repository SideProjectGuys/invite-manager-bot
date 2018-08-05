import { Client, Command, CommandDecorators, Logger, logger, Message, Middleware } from '@yamdbf/core';
import { Role } from 'discord.js';

import { createEmbed, sendEmbed } from '../../functions/Messaging';
const { resolve } = Middleware;
const { using } = CommandDecorators;

export default class extends Command<Client> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'make-mentionable',
			aliases: ['makeMentionable', 'mm'],
			desc: 'Make a role mentionable for 60 seconds or until it was used.',
			usage: '<prefix>make-mentionable Role',
			info: '',
			callerPermissions: ['MANAGE_ROLES'],
			clientPermissions: ['MANAGE_ROLES'],
			guildOnly: true
		});
	}

	@using(resolve('role: Role'))
	public async action(message: Message, [role]: [Role]): Promise<any> {
		this._logger.log(
			`${message.guild ? message.guild.name : 'DM'} (${message.author.username}): ${message.content}`
		);

		await message.delete();

		const embed = createEmbed(this.client);

		if (!role.editable) {
			embed.setDescription(`Cannot edit ${role}. Make sure the role is lower than the bots role.`);
			sendEmbed(message.channel, embed, message.author);
		} else if (role.mentionable) {
			embed.setDescription(`${role} is already mentionable.`);
			sendEmbed(message.channel, embed, message.author);
		} else {
			await role.setMentionable(true, 'Pinging role');

			(await message.channel.awaitMessages(
				(m: Message) => {
					return m.mentions.roles.has(role.id);
				},
				{ max: 1, time: 60000 })).first();

			await role.setMentionable(false, 'Done pinging role');
		}
	}
}
