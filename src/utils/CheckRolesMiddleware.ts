import { Command } from '@yamdbf/core';
import { Message } from 'discord.js';

import { BotCommand, rolePermissions, roles } from '../sequelize';
import { SettingsCache } from './SettingsCache';

export const checkRoles = (cmd: BotCommand) => {
	return async function(
		this: Command,
		message: Message,
		args: any[]
	): Promise<[Message, any[]]> {
		// Ignore PMs
		if (!message.guild) {
			return [message, args];
		}

		// Always allow guild owner
		if (message.guild.ownerID === message.author.id) {
			return [message, args];
		}

		const perms = await SettingsCache.getRoles(message.guild.id, cmd);

		// Allow commands that require no roles
		if (perms.length === 0) {
			return [message, args];
		}

		if (!perms.some(p => message.member.roles.has(p))) {
			throw Error(
				'You do not have permission to use that command.\n' +
					'You need one of the following roles: ' +
					perms.map(p => `<@&${p}>`).join(', ')
			);
		}

		return [message, args];
	};
};
