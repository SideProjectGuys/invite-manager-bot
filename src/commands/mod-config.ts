import {
	Command,
	CommandDecorators,
	Lang as YLang,
	Logger,
	logger,
	Message,
	Middleware
} from '@yamdbf/core';
import { Channel, MessageEmbed } from 'discord.js';

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
	SettingsKey,
	toDbSettingsValue
} from '../sequelize';
import { CommandGroup, createEmbed, RP, sendEmbed } from '../utils/util';

const { expect, resolve } = Middleware;
const { using, localizable } = CommandDecorators;

// Used to resolve and expect the correct arguments depending on the config key
const checkArgsMiddleware = (func: typeof resolve | typeof expect) => {
	return async function(
		message: Message,
		[rp, ..._args]: [RP, string]
	): Promise<[Message, any[]]> {
		const args = _args as string[];

		const key = args[0];
		if (!key) {
			return [message, [rp]];
		}

		const dbKey = Object.keys(SettingsKey).find(
			(k: any) => SettingsKey[k].toLowerCase() === key.toLowerCase()
		) as SettingsKey;
		if (!dbKey) {
			throw Error(rp.CMD_CONFIG_KEY_NOT_FOUND({ key }));
		}

		const value = args[1];
		if (value === undefined) {
			// We call func (resolve or expect) with the string keys, await
			// the response (which is '[message, args[]]') and unwrap the args
			// after the resource proxy
			return [
				message,
				[
					rp,
					...(await func('key: String')
						// tslint:disable-next-line:no-invalid-this
						.call(this, message, [dbKey]))[1]
				]
			];
		}

		const newArgs = ([dbKey] as any[]).concat(args.slice(1));

		if (value === 'default') {
			return [
				message,
				[
					rp,
					...(await func('key: String, ...value?: String').call(
						// tslint:disable-next-line:no-invalid-this
						this,
						message,
						newArgs
					))[1]
				]
			];
		}

		if (value === 'none' || value === 'empty' || value === 'null') {
			if (defaultSettings[dbKey] !== null) {
				throw Error(rp.CMD_CONFIG_KEY_CANT_CLEAR({ key: dbKey }));
			}
			return [
				message,
				[
					rp,
					...(await func('key: String, ...value?: String').call(
						// tslint:disable-next-line:no-invalid-this
						this,
						message,
						newArgs
					))[1]
				]
			];
		}

		const type = getSettingsType(dbKey);
		return [
			message,
			[
				rp,
				...(await func(`key: String, ...value?: ${type}`).call(
					// tslint:disable-next-line:no-invalid-this
					this,
					message,
					newArgs
				))[1]
			]
		];
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

	@localizable
	@using(checkArgsMiddleware(resolve))
	@using(checkArgsMiddleware(expect))
	public async action(
		message: Message,
		[rp, key, rawValue]: [RP, SettingsKey, any]
	): Promise<any> {
		this._logger.log(
			`${message.guild.name} (${message.author.username}): ${message.content}`
		);

		console.log(rawValue);

		const sets = message.guild.storage.settings;
		const prefix = await sets.get(SettingsKey.prefix);
		const embed = createEmbed(this.client);

		if (!key) {
			embed.setTitle(rp.CMD_CONFIG_TITLE());
			embed.setDescription(rp.CMD_CONFIG_TEXT({ prefix }));

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
					`----- ${rp.CMD_CONFIG_NOT_SET()} -----`,
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
				const clear = defaultSettings[key] === null ? 't' : undefined;
				embed.setDescription(
					rp.CMD_CONFIG_CURRENT_SET_TEXT({ prefix, key, clear })
				);
				embed.addField(rp.CMD_CONFIG_CURRENT_TITLE(), oldRawVal);
			} else {
				embed.setDescription(
					rp.CMD_CONFIG_CURRENT_NOT_SET_TEXT({ prefix, key })
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
			embed.setDescription(rp.CMD_CONFIG_ALREADY_SET_SAME_VALUE());
			embed.addField(rp.CMD_CONFIG_CURRENT_TITLE(), rawValue);
			await sendEmbed(message.channel, embed, message.author);
			return;
		}

		const error = this.validate(rp, message, key, value);
		if (error) {
			message.channel.send(error);
			return;
		}

		// Set new value
		sets.set(key, value);

		embed.setDescription(rp.CMD_CONFIG_CHANGED_TEXT({ prefix, key }));

		// Log the settings change
		this.client.logAction(message, LogAction.config, {
			key,
			oldValue: oldVal,
			newValue: value
		});

		if (oldVal) {
			embed.addField(rp.CMD_CONFIG_PREVIOUS_TITLE(), oldRawVal);
		}

		embed.addField(
			rp.CMD_CONFIG_NEW_TITLE(),
			value ? rawValue : rp.CMD_CONFIG_NONE()
		);
		oldVal = value; // Update value for future use

		// Do any post processing, such as example messages
		// If we updated a config setting, then 'oldVal' is now the new value
		const cb = await this.after(rp, message, embed, key, oldVal);

		await sendEmbed(message.channel, embed, message.author);

		if (typeof cb === typeof Function) {
			await cb();
		}
	}

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(
		rp: RP,
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
				return rp.CMD_CONFIG_CHANNEL_CANT_VIEW();
			}
			/*if (!message.guild.me.permissionsIn(channel).has('READ_MESSAGES')) {
				return rp.CMD_CONFIG_CHANNEL_CANT_READ();
			}*/
			if (!message.guild.me.permissionsIn(channel).has('SEND_MESSAGES')) {
				return rp.CMD_CONFIG_CHANNEL_CANT_SEND();
			}
			if (!message.guild.me.permissionsIn(channel).has('EMBED_LINKS')) {
				return rp.CMD_CONFIG_CHANNEL_CANT_EMBED();
			}
		}
		if (key === SettingsKey.lang) {
			if (!Lang[value]) {
				const langs = Object.keys(Lang)
					.map(k => `**${k}**`)
					.join(', ');
				return rp.CMD_CONFIG_INVALID_LANG({ value, langs });
			}
		}
		if (key === SettingsKey.leaderboardStyle) {
			if (!LeaderboardStyle[value]) {
				const styles = Object.keys(LeaderboardStyle)
					.map(k => `**${k}**`)
					.join(', ');
				return rp.CMD_CONFIG_INVALID_LEADERBOARD_STYLE({ value, styles });
			}
		}

		return null;
	}

	// Attach additional information for a config value, such as examples
	private async after(
		rp: RP,
		message: Message,
		embed: MessageEmbed,
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
						avatarUrl: user.avatarURL(),
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
				embed.addField(rp.CMD_CONFIG_PREVIEW_TITLE(), prev);
			} else {
				embed.addField(
					rp.CMD_CONFIG_PREVIEW_TITLE(),
					rp.CMD_CONFIG_PREVIEW_NEXT_MESSAGE()
				);
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
