import {
	Channel,
	Guild,
	GuildChannel,
	GuildMember,
	RichEmbed,
	User
} from 'discord.js';
import {
	Command,
	CommandDecorators,
	Logger,
	logger,
	Message,
	Middleware
} from 'yamdbf';

import { IMClient } from '../client';
import {
	customInvites,
	CustomInvitesGeneratedReason,
	defaultSettings,
	fromDbSettingsValue,
	getSettingsType,
	Lang,
	LeaderboardStyle,
	LogAction,
	sequelize,
	settings,
	SettingsKey,
	toDbSettingsValue
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

		const dbKey = Object.keys(SettingsKey).find(
			(k: any) => SettingsKey[k].toLowerCase() === key.toLowerCase()
		) as SettingsKey;
		if (!dbKey) {
			throw Error(`No config setting called **${key}** found.`);
		}

		const value = args[1];
		if (!value) {
			// tslint:disable-next-line:no-invalid-this
			return func('key: String').call(this, message, [dbKey]);
		}

		const newArgs = ([dbKey] as any[]).concat(args.slice(1));

		if (value === 'default') {
			return func('key: String, ...value?: String').call(
				// tslint:disable-next-line:no-invalid-this
				this,
				message,
				newArgs
			);
		}

		if (value === 'none' || value === 'empty' || value === 'null') {
			if (defaultSettings[dbKey] !== null) {
				throw Error(
					`The config setting **${dbKey}** can not be cleared. ` +
						`You can use \`config ${dbKey} default\` to reset it to the default value.`
				);
			}
			return func('key: String, ...value?: String').call(
				// tslint:disable-next-line:no-invalid-this
				this,
				message,
				newArgs
			);
		}

		const type = getSettingsType(dbKey);
		// tslint:disable-next-line:no-invalid-this
		return func(`key: String, ...value?: ${type}`).call(this, message, newArgs);
	};
};

export default class extends Command<IMClient> {
	@logger('Command') private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'config',
			aliases: ['set', 'change', 'get', 'show'],
			desc: 'Show and change the config of the server',
			usage: '<prefix>config (key) (value)',
			info:
				'`key`:\n' +
				'The config setting which you want to show/change.\n\n' +
				'`value`:\n' +
				'The new value of the setting.\n\n' +
				'Use without args to show the current settings and all keys.\n',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Admin,
			guildOnly: true
		});
	}

	@using(checkArgsMiddleware(resolve))
	@using(checkArgsMiddleware(expect))
	public async action(
		message: Message,
		[key, rawValue]: [SettingsKey, any]
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

		const sets = message.guild.storage.settings;
		const prefix = await sets.get('prefix');
		const embed = createEmbed(this.client);

		if (!key) {
			embed.setTitle('Your config settings');
			embed.setDescription(
				'Below are all the config settings of your server.\n' +
					`Use \`${prefix}config <key>\` to view a single setting\n` +
					`Use \`${prefix}config <key> <value>\` to set the config <key> to <value>`
			);

			const notSet = [];
			const keys = Object.keys(SettingsKey);
			for (let i = 0; i < keys.length; i++) {
				const val = await sets.get(keys[i]);
				if (val) {
					embed.addField(
						keys[i],
						fromDbSettingsValue(keys[i] as SettingsKey, val)
					);
				} else {
					notSet.push(keys[i]);
				}
			}

			if (notSet.length > 0) {
				embed.addField(
					'----- These settings are not set -----',
					notSet.join('\n')
				);
			}

			await sendEmbed(message.channel, embed, message.author);
			return;
		}

		let oldVal = await sets.get(key);
		let oldRawVal = fromDbSettingsValue(key, oldVal);
		if (typeof oldRawVal === 'string' && oldRawVal.length > 1000) {
			oldRawVal = oldRawVal.substr(0, 1000) + '...';
		}

		embed.setTitle(key);

		if (typeof rawValue === typeof undefined) {
			// If we have no new value, just print the old one
			// Check if the old one is set
			if (oldVal) {
				embed.setDescription(
					`This config is currently set.\n` +
						`Use \`${prefix}config ${key} <value>\` to change it.\n` +
						`Use \`${prefix}config ${key} default\` to reset it to the default.\n` +
						(defaultSettings[key] === null
							? `Use \`${prefix}config ${key} none\` to clear it.`
							: '')
				);
				embed.addField('Current Value', oldRawVal);
			} else {
				embed.setDescription(
					`This config is currently **not** set.\nUse \`${prefix}config ${key} <value>\` to set it.`
				);
			}
			await sendEmbed(message.channel, embed, message.author);
			return;
		}

		const parsedValue = toDbSettingsValue(key, rawValue);
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

		// Set new value
		sets.set(key, value);

		embed.setDescription(
			`This config has been changed.\n` +
				`Use \`${prefix}config ${key} <value>\` to change it again.\n` +
				`Use \`${prefix}config ${key} none\` to reset it to the default.`
		);

		// Log the settings change
		this.client.logAction(message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal) {
			embed.addField('Previous Value', oldRawVal);
		}

		embed.addField('New Value', value ? rawValue : 'None');
		oldVal = value; // Update value for future use

		// Do any post processing, such as example messages
		// If we updated a config setting, then 'oldVal' is now the new value
		const cb = await this.after(message, embed, key, oldVal);

		await sendEmbed(message.channel, embed, message.author);

		if (typeof cb === typeof Function) {
			await cb();
		}
	}

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(
		message: Message,
		key: SettingsKey,
		value: any
	): string | null {
		if (value === null || value === undefined) {
			return null;
		}

		const type = getSettingsType(key);

		if (type === 'Channel') {
			const channel = value as Channel;
			if (!message.guild.me.permissionsIn(channel).has('VIEW_CHANNEL')) {
				return `I don't have permission to **view** that channel`;
			}
			if (!message.guild.me.permissionsIn(channel).has('READ_MESSAGES')) {
				return `I don't have permission to **read messages** in that channel`;
			}
			if (!message.guild.me.permissionsIn(channel).has('SEND_MESSAGES')) {
				return `I don't have permission to **send messages** in that channel`;
			}
			if (!message.guild.me.permissionsIn(channel).has('EMBED_LINKS')) {
				return `I don't have permission to **embed links** in that channel`;
			}
		}
		if (key === SettingsKey.lang) {
			if (!Lang[value]) {
				const langs = Object.keys(Lang)
					.map(k => `**${k}**`)
					.join(', ');
				return `Invalid language **${value}**. The following languages are supported: ${langs}`;
			}
		}
		if (key === SettingsKey.leaderboardStyle) {
			if (!LeaderboardStyle[value]) {
				const styles = Object.keys(LeaderboardStyle)
					.map(k => `**${k}**`)
					.join(', ');
				return `Invalid leaderboard style **${value}**. The following styles are supported: ${styles}`;
			}
		}

		return null;
	}

	// Attach additional information for a config value, such as examples
	private async after(
		message: Message,
		embed: RichEmbed,
		key: SettingsKey,
		value: any
	): Promise<Function> {
		const me = message.member.guild.me;
		const member = message.member;
		const user = member.user;

		if (
			value &&
			(key === SettingsKey.joinMessage || key === SettingsKey.leaveMessage)
		) {
			const prev = await this.client.fillTemplate(
				value,
				message.guild,
				{
					id: member.id,
					joinedAt: member.joinedTimestamp,
					nick: member.nickname,
					user: {
						id: user.id,
						avatarUrl: user.avatarURL,
						createdAt: user.createdTimestamp,
						bot: user.bot,
						discriminator: user.discriminator,
						username: user.username
					}
				},
				'tEsTcOdE',
				message.channel.id,
				(message.channel as any).name,
				me.id,
				me.nickname,
				me.user.discriminator,
				me,
				{
					total: Math.round(Math.random() * 1000),
					regular: Math.round(Math.random() * 1000),
					custom: Math.round(Math.random() * 1000),
					fake: Math.round(Math.random() * 1000),
					leave: Math.round(Math.random() * 1000)
				}
			);

			if (typeof prev === 'string') {
				embed.addField('Preview', prev);
			} else {
				embed.addField('Preview', '<See next message>');
				return () => sendEmbed(message.channel, prev);
			}
		}

		if (key === SettingsKey.autoSubtractFakes) {
			if (value === 'true') {
				// Subtract fake invites from all members
				let cmd = this.client.commands.resolve('subtract-fakes');
				return async () => await cmd.action(message, []);
			} else if (value === 'false') {
				// Delete old duplicate removals
				return async () =>
					await customInvites.destroy({
						where: {
							guildId: message.guild.id,
							generatedReason: CustomInvitesGeneratedReason.fake
						}
					});
			}
		}

		if (key === SettingsKey.autoSubtractLeaves) {
			if (value === 'true') {
				// Subtract leaves from all members
				let cmd = this.client.commands.resolve('subtract-leaves');
				return async () => await cmd.action(message, []);
			} else if (value === 'false') {
				// Delete old leave removals
				return async () =>
					await customInvites.destroy({
						where: {
							guildId: message.guild.id,
							generatedReason: CustomInvitesGeneratedReason.leave
						}
					});
			}
		}

		if (key === SettingsKey.autoSubtractLeaveThreshold) {
			// Subtract leaves from all members to recompute threshold time
			let cmd = this.client.commands.resolve('subtract-leaves');
			return async () => await cmd.action(message, []);
		}
	}
}
