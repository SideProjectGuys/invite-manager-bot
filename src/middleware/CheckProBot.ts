import { Command } from '@yamdbf/core';
import { Message } from 'discord.js';

import { IMClient } from '../client';

export async function checkProBot(
	this: Command<IMClient>,
	message: Message,
	args: any[]
): Promise<[Message, any[]]> {
	// Ignore PMs
	if (!message.guild) {
		return [message, args];
	}

	if (
		this.client.disabledGuilds.has(message.guild.id) &&
		!message.content.startsWith(`<@!${this.client.user.id}>`)
	) {
		return;
	}

	return [message, args];
}
