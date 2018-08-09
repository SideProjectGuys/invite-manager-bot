import { Command, Lang } from '@yamdbf/core';
import { Message } from 'discord.js';

import { BotCommand, RP } from '../types';

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

		const lang = (await SettingsCache.get(message.guild.id)).lang;
		const rp = Lang.createResourceProxy(lang) as RP;

		// Always allow admins
		let member = message.member;
		if (!member) {
			member = await message.guild.members.fetch(message.author.id);
		}
		if (!member) {
			console.error(
				`Could not get member ${message.author.id} for ${message.guild.id}`
			);
			throw Error(rp.PERMISSIONS_MEMBER_ERROR());
		}

		if (message.member.hasPermission('ADMINISTRATOR')) {
			return [message, args];
		}

		const perms = (await SettingsCache.getPermissions(message.guild.id))[cmd];

		// Allow commands that require no roles, if strict is not true
		if (perms.length === 0) {
			if (isStrict(cmd)) {
				throw Error(rp.PERMISSIONS_ADMIN_ONLY());
			}
			return [message, args];
		}

		// Check that we have at least one of the required roles
		if (!perms.some(p => message.member.roles.has(p))) {
			throw Error(
				rp.PERMISSIONS_MISSING_ROLE({
					roles: perms.map(p => `<@&${p}>`).join(', ')
				})
			);
		}

		return [message, args];
	};
};
