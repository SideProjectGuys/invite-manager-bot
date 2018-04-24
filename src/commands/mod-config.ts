import { Channel, Guild, GuildChannel, GuildMember, RichEmbed, User } from 'discord.js';
import { Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { IMClient } from '../client';
import { getSettingsType, LogAction, settings, SettingsKey } from '../sequelize';
import { CommandGroup, createEmbed, defaultJoinMessage, defaultLeaveMessage, logAction } from '../utils/util';

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
			throw Error(`No config setting called '${key}' found.`);
		}

		const value = args[1];
		if (!value) {
			// tslint:disable-next-line:no-invalid-this
			return func('key: String').call(this, message, args);
		}

		if (value === 'none' || value === 'empty' || value === 'null') {
			// tslint:disable-next-line:no-invalid-this
			return func('key: String, ...value?: String').call(this, message, args);
		}

		const type = getSettingsType(dbKey);
		// tslint:disable-next-line:no-invalid-this
		return func(`key: String, ...value?: ${type}`).call(this, message, args);
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
				'`' + 'key    The config setting which you want to show/change.' + 'value  The new value of the setting.' + '`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Admin,
			guildOnly: true
		});
	}

	@using(checkArgsMiddleware(resolve))
	@using(checkArgsMiddleware(expect))
	public async action(message: Message, [key, rawValue]: [SettingsKey, any]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		const sets = message.guild.storage.settings;
		const prefix = await sets.get('prefix');

		if (key) {
			let oldVal = await sets.get(key);
			const oldRawVal = this.fromDbValue(key, oldVal);

			const embed = new RichEmbed().setTitle(key);
			createEmbed(this.client, embed);

			if (typeof rawValue !== typeof undefined) {
				const parsedValue = this.toDbValue(message.guild, key, rawValue);
				if (parsedValue.error) {
					message.channel.send(parsedValue.error);
					return;
				}

				const value = parsedValue.value;

				if (value === oldVal) {
					embed.setDescription(`This config is already set to that value`);
					embed.addField('Current Value', rawValue);
				} else {
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
					await logAction(message, LogAction.config, {
						key,
						oldValue: oldVal,
						newValue: value
					});

					if (oldVal) {
						embed.addField('Previous Value', oldRawVal);
					}

					embed.addField('New Value', value ? rawValue : 'None');
					oldVal = value; // Update value for future use
				}
			} else {
				// If we have no new value, just print the old one
				// Check if the old one is set
				if (oldVal) {
					embed.setDescription(
						`This config is currently set.\n` +
							`Use \`${prefix}config ${key} <value>\` to change it.\n` +
							`Use \`${prefix}config ${key} none\` to reset it to the default.`
					);
					embed.addField('Current Value', oldRawVal);
				} else {
					embed.setDescription(
						`This config is currently **not** set / set to the **default**.\n` +
							`Use \`${prefix}config ${key} <value>\` to set it.`
					);
				}
			}

			// Do any post processing, such as example messages
			// If we updated a config setting, then 'oldVal' is now the new value
			this.after(message, embed, key, oldVal);

			message.channel.send({ embed });
		} else {
			const embed = new RichEmbed();

			embed.setTitle('Your config settings');
			embed.setDescription(
				'Below are all the config settings of your server.\n' +
					'Use `!config <key>` to view a single setting\n' +
					'Use `!config <key> <value>` to set the config <key> to <value>'
			);

			const notSet = [];
			const keys = Object.keys(SettingsKey);
			for (let i = 0; i < keys.length; i++) {
				const val = await sets.get(keys[i]);
				if (val) {
					embed.addField(keys[i], this.fromDbValue(keys[i] as SettingsKey, val));
				} else {
					notSet.push(keys[i]);
				}
			}

			if (notSet.length > 0) {
				embed.addField('----- These config keys are not set -----', notSet.join('\n'));
			}

			createEmbed(message.client, embed);
			message.channel.send({ embed });
		}
	}

	// Convert a raw value into something we can save in the database
	private toDbValue(guild: Guild, key: SettingsKey, value: any): { value?: string; error?: string } {
		if (value === 'none' || value === 'empty' || value === 'null') {
			return { value: null };
		}

		const type = getSettingsType(key);
		if (type === 'Channel') {
			return { value: (value as Channel).id };
		}
		if (type === 'Boolean') {
			return { value: value ? 'true' : 'false' };
		}

		return { value };
	}

	// Convert a DB value into a human readable value
	private fromDbValue(key: SettingsKey, value: string): string {
		if (value === undefined || value === null) {
			return value;
		}

		const type = getSettingsType(key);
		if (type === 'Channel') {
			return `<#${value}>`;
		}

		return value;
	}

	// Validate a new config value to see if it's ok (no parsing, already done beforehand)
	private validate(message: Message, key: SettingsKey, value: any): string | null {
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

		return null;
	}

	// Attach additional information for a config value, such as examples
	private after(message: Message, embed: RichEmbed, key: SettingsKey, value: any): void {
		const me = message.member.guild.me;

		if (key === SettingsKey.joinMessage) {
			const val = value ? value : defaultJoinMessage;
			embed.addField(
				'Preview',
				val
					.replace('{memberName}', message.member.displayName)
					.replace('{memberMention}', `<@${message.member.id}>`)
					.replace('{inviterName}', me.displayName)
					.replace('{inviterMention}', `<@${me.id}>`)
					.replace('{numInvites}', (Math.random() * 1000).toFixed(0))
			);
		}
		if (key === SettingsKey.leaveMessage) {
			const val = value ? value : defaultLeaveMessage;
			embed.addField(
				'Preview',
				val
					.replace('{memberName}', message.member.displayName)
					.replace('{inviterName}', me.displayName)
					.replace('{inviterMention}', `<@${me.id}>`)
					.replace('{numInvites}', (Math.random() * 1000).toFixed(0))
			);
		}
	}
}
