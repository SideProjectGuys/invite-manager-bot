import { Command } from '@yamdbf/core';
import { Message } from 'discord.js';

import { BotCommand } from '../types';

import { SettingsCache } from '../storage/SettingsCache';

export function isStrict(cmd: BotCommand) {
	switch (cmd) {
		case BotCommand.config:
		case BotCommand.inviteCodeConfig:
		case BotCommand.memberConfig:
		case BotCommand.permissions:
		case BotCommand.setup:
		case BotCommand.addInvites:
		case BotCommand.clearInvites:
		case BotCommand.info:
		case BotCommand.restoreInvites:
		case BotCommand.subtractFakes:
		case BotCommand.subtractLeaves:
		case BotCommand.export:
		case BotCommand.tryPremium:
		case BotCommand.addRank:
		case BotCommand.removeRank:
			return true;

		default:
			return false;
	}
}

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
		if (message.member.hasPermission('ADMINISTRATOR')) {
			return [message, args];
		}

		const perms = (await SettingsCache.getPermissions(message.guild.id))[cmd];

		// Allow commands that require no roles, if strict is not true
		if (perms.length === 0) {
			if (isStrict(cmd)) {
				throw Error(
					'You do not have permission to use this command.\n' +
						'Only the server owner may use this command.'
				);
			}
			return [message, args];
		}

		if (!perms.some(p => message.member.roles.has(p))) {
			throw Error(
				'You do not have permission to use this command.\n' +
					'You need one of the following roles: ' +
					perms.map(p => `<@&${p}>`).join(', ')
			);
		}

		return [message, args];
	};
};
