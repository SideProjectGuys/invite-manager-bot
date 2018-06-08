import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { Guild, User } from 'discord.js';

import { IMClient } from '../client';
import {
	defaultMemberSettings,
	getMemberSettingsType,
	LogAction,
	members,
	memberSettings,
	MemberSettingsKey,
	sequelize
} from '../sequelize';
import { CommandGroup, createEmbed, sendEmbed } from '../utils/util';

const { expect, resolve } = Middleware;
const { using } = CommandDecorators;

// Used to resolve and expect the correct arguments depending on the config key
const checkArgsMiddleware = (func: typeof resolve | typeof expect) => {
	return function(message: Message, args: string[]) {
		const key = args[0];
		if (!key) {
			return [message, args];
		}

		let dbKey: MemberSettingsKey = Object.keys(MemberSettingsKey).find(
			(k: any) => MemberSettingsKey[k].toLowerCase() === key.toLowerCase()
		) as MemberSettingsKey;
		if (!dbKey) {
			throw Error(`No config setting called **${key}** found.`);
		}

		const user = args[1];
		if (!user) {
			// tslint:disable-next-line:no-invalid-this
			return func('key: String').call(this, message, [dbKey]);
		}

		const value = args[2];
		if (!value) {
			// tslint:disable-next-line:no-invalid-this
			return func('key: String, user: User').call(this, message, [dbKey, user]);
		}

		const newArgs = ([dbKey, user] as any[]).concat(args.slice(2));

		if (value === 'default') {
			return func('key: String, user: User, ...value?: String').call(
				// tslint:disable-next-line:no-invalid-this
				this,
				message,
				newArgs
			);
		}

		if (value === 'none' || value === 'empty' || value === 'null') {
			if (defaultMemberSettings[dbKey] !== null) {
				throw Error(
					`The config setting **${dbKey}** can not be cleared. ` +
						`You can use \`config ${dbKey} default\` to reset it to the default value.`
				);
			}
			return func('key: String, user: User, ...value?: String').call(
				// tslint:disable-next-line:no-invalid-this
				this,
				message,
				newArgs
			);
		}

		const type = getMemberSettingsType(dbKey);
		return func(`key: String, user: User, ...value?: ${type}`).call(
			// tslint:disable-next-line:no-invalid-this
			this,
			message,
			newArgs
		);
	};
};

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'memberconfig',
			aliases: ['memconfig', 'memconf'],
			desc: 'Show and change the config of members of the server',
			usage: '<prefix>memconf @user (key) (value)',
			info:
				'`@user`:\n' +
				'The member that the setting is changed for.\n\n' +
				'`key`:\n' +
				'The config setting which you want to show/change.\n\n' +
				'`value`:\n' +
				'The new value of the setting.\n\n' +
				'Use without args to show all set configs and keys.\n',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Admin,
			guildOnly: true
		});
	}

	@using(checkArgsMiddleware(resolve))
	@using(checkArgsMiddleware(expect))
	public async action(
		message: Message,
		[key, user, rawValue]: [MemberSettingsKey, User, any]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		// TODO: Temporary hack because boolean resolver doesn't work
		if (rawValue === '__true__') {
			rawValue = true;
		} else if (rawValue === '__false__') {
			rawValue = false;
		}

		const prefix = await message.guild.storage.settings.get('prefix');
		const embed = createEmbed(this.client);

		if (!key) {
			embed.setTitle('Your config settings');
			embed.setDescription(
				'Below are all the available config settings.\n' +
					`Use \`${prefix}config <key>\` to view the users which have a \`<key>\` setting\n` +
					`Use \`${prefix}config <key> @user\` to view the setting for a single \`@user\`\n` +
					`Use \`${prefix}config <key> @user <value>\` to set the config \`<key>\` to ` +
					`\`<value>\` for \`@user\``
			);

			const keys = Object.keys(MemberSettingsKey);
			embed.addField('Valid config keys', keys.join('\n'));

			await sendEmbed(message.channel, embed, message.author);
			return;
		}

		if (!user) {
			const allSets = await memberSettings.findAll({
				attributes: [
					'id',
					'key',
					'value',
					[sequelize.literal('`member`.`name`'), 'memberName']
				],
				where: {
					guildId: message.guild.id,
					key
				},
				include: [
					{
						attributes: [],
						model: members
					}
				],
				raw: true
			});
			if (allSets.length > 0) {
				allSets.forEach((set: any) =>
					embed.addField(set.memberName, set.value)
				);
			} else {
				embed.setDescription(
					'This config settings is currently not set for any members'
				);
			}
			await sendEmbed(message.channel, embed, message.author);
			return;
		}

		const un = user.username;
		const oldSet = await memberSettings.find({
			where: {
				guildId: message.guild.id,
				memberId: user.id,
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
				embed.setDescription(
					`This config is currently set.\n` +
						`Use \`${prefix}config ${key} @${un} <value>\` to change it.\n` +
						`Use \`${prefix}config ${key} @${un} default\` to reset it to the default.\n` +
						(defaultMemberSettings[key] === null
							? `Use \`${prefix}config ${key} @${un} none\` to clear it.`
							: '')
				);
				embed.addField('Current Value', oldRawVal);
			} else {
				embed.setDescription(
					`This config is currently **not** set.\n` +
						`Use \`${prefix}config ${key} @${un} <value>\` to set it.`
				);
			}
			await sendEmbed(message.channel, embed, message.author);
			return;
		}

		const parsedValue = this.toDbValue(message.guild, key, rawValue);
		if (parsedValue.error) {
			message.channel.send(parsedValue.error);
			return;
		}

		const value = parsedValue.value;
		if (rawValue.length > 1000) {
			rawValue = rawValue.substr(0, 1000) + '...';
		}

		if (value === oldVal) {
			embed.setDescription(`This config is already set to that value`);
			embed.addField('Current Value', rawValue);
			await sendEmbed(message.channel, embed, message.author);
			return;
		}

		const error = this.validate(message, key, value);
		if (error) {
			message.channel.send(error);
			return;
		}

		await memberSettings.insertOrUpdate({
			id: null,
			guildId: message.guild.id,
			memberId: user.id,
			key,
			value
		});

		embed.setDescription(
			`This config has been changed.\n` +
				`Use \`${prefix}config ${key} @${un} <value>\` to change it again.\n` +
				`Use \`${prefix}config ${key} @${un} none\` to reset it to the default.`
		);

		// Log the settings change
		this.client.logAction(message, LogAction.memberConfig, {
			key,
			userId: user.id,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal) {
			embed.addField('Previous Value', oldRawVal);
		}

		embed.addField('New Value', value ? rawValue : 'None');
		oldVal = value; // Update value for future use

		await sendEmbed(message.channel, embed, message.author);
	}

	// Convert a raw value into something we can save in the database
	private toDbValue(
		guild: Guild,
		key: MemberSettingsKey,
		value: any
	): { value?: string; error?: string } {
		if (value === 'default') {
			return { value: defaultMemberSettings[key] };
		}
		if (value === 'none' || value === 'empty' || value === 'null') {
			return { value: null };
		}

		const type = getMemberSettingsType(key);
		if (type === 'Boolean') {
			return { value: value ? 'true' : 'false' };
		}

		return { value };
	}

	// Convert a DB value into a human readable value
	private fromDbValue(key: MemberSettingsKey, value: string): string {
		if (value === undefined || value === null) {
			return value;
		}

		/*const type = getMemberSettingsType(key);
		if (type === 'Channel') {
			return `<#${value}>`;
		}*/

		return value;
	}

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(
		message: Message,
		key: MemberSettingsKey,
		value: any
	): string | null {
		if (value === null || value === undefined) {
			return null;
		}

		/*const type = getMemberSettingsType(key);*/

		return null;
	}
}
