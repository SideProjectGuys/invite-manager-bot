import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { Guild } from 'discord.js';

import { IMClient } from '../../client';
import { createEmbed, sendReply } from '../../functions/Messaging';
import { checkProBot, checkRoles } from '../../middleware';
import {
	channels,
	defaultInviteCodeSettings,
	getInviteCodeSettingsType,
	inviteCodes,
	inviteCodeSettings,
	InviteCodeSettingsKey,
	LogAction
} from '../../sequelize';
import { SettingsCache } from '../../storage/SettingsCache';
import { BotCommand, CommandGroup, RP } from '../../types';

const { expect, resolve, localize } = Middleware;
const { using } = CommandDecorators;

// Used to resolve and expect the correct arguments depending on the config key
const checkArgsMiddleware = (func: typeof resolve | typeof expect) => {
	return async function(
		this: Command,
		message: Message,
		[rp, ..._args]: [RP, string]
	): Promise<[Message, any[]]> {
		const args = _args as string[];

		const key = args[0];
		if (!key) {
			return [message, [rp]];
		}

		let dbKey: InviteCodeSettingsKey = Object.keys(InviteCodeSettingsKey).find(
			(k: any) => InviteCodeSettingsKey[k].toLowerCase() === key.toLowerCase()
		) as InviteCodeSettingsKey;
		if (!dbKey) {
			sendReply(message, rp.CMD_INVITECODECONFIG_KEY_NOT_FOUND({ key }));
			return; // We have to return undefined because this is a middleware
		}

		const code = args[1];
		if (!code) {
			// We call func (resolve or expect) with the string keys, await
			// the response (which is '[message, args[]]') and unwrap the args
			// after the resource proxy
			return [
				message,
				[rp, ...(await func('key: String').call(this, message, [dbKey]))[1]]
			];
		}

		const value = args[2];
		if (typeof value === 'undefined') {
			return [
				message,
				[
					rp,
					...(await func('key: String, code: String').call(this, message, [
						dbKey,
						code
					]))[1]
				]
			];
		}

		const newArgs = ([dbKey, code] as any[]).concat(args.slice(2));

		if (value === 'default') {
			return [
				message,
				[
					rp,
					...(await func('key: String, code: String, ...value?: String').call(
						this,
						message,
						newArgs
					))[1]
				]
			];
		}

		if (value === 'none' || value === 'empty' || value === 'null') {
			if (defaultInviteCodeSettings[dbKey] !== null) {
				const prefix = (await SettingsCache.get(message.guild.id)).prefix;
				sendReply(
					message,
					rp.CMD_INVITECODECONFIG_KEY_CANT_CLEAR({ prefix, key: dbKey })
				);
				return; // We have to return undefined because this is a middleware
			}
			return [
				message,
				[
					rp,
					...(await func('key: String, code: String, ...value?: String').call(
						this,
						message,
						newArgs
					))[1]
				]
			];
		}

		const type = getInviteCodeSettingsType(dbKey);
		return [
			message,
			[
				rp,
				...(await func(`key: String, code: String, ...value?: ${type}`).call(
					this,
					message,
					newArgs
				))[1]
			]
		];
	};
};

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'invitecodeconfig',
			aliases: ['invcodeconfig', 'invcodeconf', 'icc'],
			desc: 'Show and change the config of invite codes of the server',
			usage: '<prefix>icc key (code) (value)',
			info:
				'`key`:\n' +
				'The config setting which you want to show/change.\n\n' +
				'`code`:\n' +
				'The invite code that the setting is changed for.\n\n' +
				'`value`:\n' +
				'The new value of the setting.\n\n' +
				'Use without args to show all set configs and keys.\n',
			group: CommandGroup.Config,
			guildOnly: true
		});
	}

	@using(checkProBot)
	@using(checkRoles(BotCommand.inviteCodeConfig))
	@using(localize)
	@using(checkArgsMiddleware(resolve))
	@using(checkArgsMiddleware(expect))
	public async action(
		message: Message,
		[rp, key, code, rawValue]: [RP, InviteCodeSettingsKey, string, any]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		const prefix = (await SettingsCache.get(message.guild.id)).prefix;
		const embed = createEmbed(this.client);

		if (!key) {
			embed.setTitle(rp.CMD_INVITECODECONFIG_TITLE());
			embed.setDescription(rp.CMD_INVITECODECONFIG_TEXT({ prefix }));

			const keys = Object.keys(InviteCodeSettingsKey);
			embed.addField(rp.CMD_INVITECODECONFIG_KEYS_TITLE(), keys.join('\n'));

			return sendReply(message, embed);
		}

		if (!code) {
			const allSets = await inviteCodeSettings.findAll({
				attributes: ['id', 'key', 'value', 'inviteCode'],
				where: {
					guildId: message.guild.id,
					key
				},
				raw: true
			});
			if (allSets.length > 0) {
				allSets.forEach((set: any) =>
					embed.addField(set.inviteCode, this.fromDbValue(set.key, set.value))
				);
			} else {
				embed.setDescription(rp.CMD_INVITECODECONFIG_NOT_SET_ANY_TEXT());
			}
			return sendReply(message, embed);
		}

		// Check if this is actually a real invite code
		const inv = await this.client.fetchInvite(code);
		if (!inv) {
			return sendReply(message, rp.CMD_INVITECODECONFIG_INVALID_CODE());
		}
		if (inv.guild.id !== message.guild.id) {
			return sendReply(message, rp.CMD_INVITECODECONFIG_CODE_FOR_OTHER_GUILD());
		}

		const oldSet = await inviteCodeSettings.find({
			where: {
				guildId: message.guild.id,
				inviteCode: code,
				key
			},
			raw: true
		});

		let oldVal = oldSet ? oldSet.value : undefined;
		let oldRawVal = this.fromDbValue(key, oldVal);
		if (oldRawVal && oldRawVal.length > 1000) {
			oldRawVal = oldRawVal.substr(0, 1000) + '...';
		}

		embed.setTitle(key);

		if (typeof rawValue === typeof undefined) {
			// If we have no new value, just print the old one
			// Check if the old one is set
			if (oldVal) {
				const clear = defaultInviteCodeSettings[key] === null ? 't' : undefined;
				embed.setDescription(
					rp.CMD_INVITECODECONFIG_CURRENT_SET_TEXT({
						prefix,
						key,
						code,
						clear
					})
				);
				embed.addField(rp.CMD_INVITECODECONFIG_CURRENT_TITLE(), oldRawVal);
			} else {
				embed.setDescription(
					rp.CMD_INVITECODECONFIG_CURRENT_NOT_SET_TEXT({ prefix })
				);
			}
			return sendReply(message, embed);
		}

		const parsedValue = this.toDbValue(message.guild, key, rawValue);
		if (parsedValue.error) {
			return sendReply(message, parsedValue.error);
		}

		const value = parsedValue.value;
		if (rawValue.length > 1000) {
			rawValue = rawValue.substr(0, 1000) + '...';
		}

		if (value === oldVal) {
			embed.setDescription(rp.CMD_INVITECODECONFIG_ALREADY_SET_SAME_VALUE());
			embed.addField(rp.CMD_INVITECODECONFIG_CURRENT_TITLE(), rawValue);
			return sendReply(message, embed);
		}

		const error = this.validate(rp, message, key, value);
		if (error) {
			return sendReply(message, error);
		}

		await channels.insertOrUpdate({
			id: inv.channel.id,
			guildId: inv.guild.id,
			name: inv.channel.name
		});

		await inviteCodes.insertOrUpdate({
			code: inv.code,
			guildId: inv.guild.id,
			inviterId: inv.inviter.id,
			channelId: inv.channel.id,
			uses: inv.uses,
			maxAge: inv.maxAge,
			maxUses: inv.maxUses,
			temporary: inv.temporary,
			createdAt: inv.createdTimestamp
		});

		await inviteCodeSettings.insertOrUpdate({
			id: null,
			guildId: message.guild.id,
			inviteCode: code,
			key,
			value
		});

		embed.setDescription(
			rp.CMD_INVITECODECONFIG_CHANGED_TEXT({ prefix, key, code })
		);

		// Log the settings change
		this.client.logAction(message, LogAction.memberConfig, {
			key,
			inviteCode: code,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal) {
			embed.addField(rp.CMD_INVITECODECONFIG_PREVIOUS_TITLE(), oldRawVal);
		}

		embed.addField(
			rp.CMD_INVITECODECONFIG_NEW_TITLE(),
			value ? rawValue : rp.CMD_INVITECODECONFIG_NONE()
		);
		oldVal = value; // Update value for future use

		return sendReply(message, embed);
	}

	// Convert a raw value into something we can save in the database
	private toDbValue(
		guild: Guild,
		key: InviteCodeSettingsKey,
		value: any
	): { value?: string; error?: string } {
		if (value === 'default') {
			return { value: defaultInviteCodeSettings[key] };
		}
		if (value === 'none' || value === 'empty' || value === 'null') {
			return { value: null };
		}

		if (key === InviteCodeSettingsKey.roles) {
			const roles: string[] = value
				.split(' ')
				.map((r: string) => r.substring(3, r.length - 1));
			return { value: roles.join(',') };
		}

		const type = getInviteCodeSettingsType(key);
		if (type === 'Boolean') {
			return { value: value ? 'true' : 'false' };
		}

		return { value };
	}

	// Convert a DB value into a human readable value
	private fromDbValue(key: InviteCodeSettingsKey, value: string): string {
		if (value === undefined || value === null) {
			return value;
		}

		if (key === InviteCodeSettingsKey.roles) {
			return value
				.split(',')
				.map(r => `<@&${r}>`)
				.join(' ');
		}

		/*const type = getMemberSettingsType(key);
		if (type === 'Channel') {
			return `<#${value}>`;
		}*/

		return value;
	}

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(
		rp: RP,
		message: Message,
		key: InviteCodeSettingsKey,
		value: any
	): string | null {
		if (value === null || value === undefined) {
			return null;
		}

		if (key === InviteCodeSettingsKey.roles) {
			const roles: string[] = value.split(/[ ,]/g);
			if (!roles.every(r => !!message.guild.roles.get(r))) {
				return rp.CMD_INVITECODECONFIG_INVALID_ROLE();
			}
		}

		/*const type = getMemberSettingsType(key);*/

		return null;
	}
}
