import { Channel, Guild, RichEmbed, User } from 'discord.js';
import { Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { IMClient } from '../client';
import { ActivityAction, settings, SettingsKeys } from '../sequelize';
import { CommandGroup, createEmbed, logAction } from '../utils/util';

const { expect, resolve } = Middleware;
const { using } = CommandDecorators;

// Used to resolve and expect the correct arguments depending on the config key
const checkArgsMiddleware = (func: typeof resolve | typeof expect) => {
	return function (message: Message, args: string[]) {
		const key = args[0];
		if (!key) {
			return [message, args];
		}

		const dbKey = Object.keys(SettingsKeys)
			.find((k: any) => SettingsKeys[k].toLowerCase() === key.toLowerCase()) as SettingsKeys;
		if (!dbKey) {
			throw Error(`No config setting called '${key}' found.`);
		}

		const value = args[1];
		if (!value) {
			// tslint:disable-next-line:no-invalid-this
			return func('key: String').call(this, message, args);
		}

		if (dbKey === SettingsKeys.joinMessageChannel || dbKey === SettingsKeys.leaveMessageChannel) {
			// tslint:disable-next-line:no-invalid-this
			return func('key: String, ...value?: Channel').call(this, message, args);
		} else {
			// tslint:disable-next-line:no-invalid-this
			return func('key: String, ...value?: String').call(this, message, args);
		}
	};
};

export default class extends Command<IMClient> {
	@logger('Command')
	private readonly _logger: Logger;

	public constructor() {
		super({
			name: 'config',
			aliases: ['set', 'change', 'get', 'show'],
			desc: 'Show and change the config of the server',
			usage: '<prefix>config (key) (value)',
			info: '`' +
				'key    The config setting which you want to show/change.' +
				'value  The new value of the setting.' +
				'`',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			group: CommandGroup.Admin,
			guildOnly: true,
		});
	}

	@using(checkArgsMiddleware(resolve))
	@using(checkArgsMiddleware(expect))
	public async action(message: Message, [key, rawValue]: [SettingsKeys, any]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		const sets = message.guild.storage.settings;
		if (key) {
			const oldVal = await sets.get(key);
			const oldRawVal = this.fromDbValue(key, oldVal);

			if (rawValue) {
				const parsedValue = this.toDbValue(message.guild, key, rawValue);
				if (parsedValue.error) {
					message.channel.send(parsedValue.error);
					return;
				}

				const value = parsedValue.value;

				if (value === oldVal) {
					message.channel.send(`Config **${key}** is already set to **${rawValue}**`);
					return;
				}

				// Set the setting through our storage provider
				await message.guild.storage.settings.set(key, value);

				// Set new value
				sets.set(key, value);

				await logAction(ActivityAction.config, message.guild.id, message.author.id, {
					key,
					oldValue: oldRawVal,
					newValue: rawValue,
				});

				if (oldVal) {
					if (value) {
						message.channel.send(`Changed **${key}** from **${oldRawVal}** to **${rawValue}**`);
					} else {
						message.channel.send(`Config **${key}** cleared and reset to **default**`);
					}
				} else {
					message.channel.send(`Set **${key}** to **${rawValue}**`);
				}
			} else {
				if (!oldVal) {
					message.channel.send(`Config **${key}** is not set.`);
				} else {
					message.channel.send(`Config **${key}** is set to **${oldRawVal}**`);
				}
			}
		} else {
			const embed = new RichEmbed();

			embed.setTitle('Your config settings');
			embed.setDescription('Below are all the config settings of your server.\n' +
				'Use `!config <key> <value>` to set the config <key> to <value>');

			const notSet = [];
			const keys = Object.keys(SettingsKeys);
			for (let i = 0; i < keys.length; i++) {
				const val = await sets.get(keys[i]);
				if (val) {
					embed.addField(keys[i], this.fromDbValue(keys[i] as SettingsKeys, val), true);
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

	private toDbValue(guild: Guild, key: SettingsKeys, value: any): { value?: string, error?: string } {
		if (value === 'none' || value === 'empty' || value === 'null') {
			return { value: null };
		}

		if (key === SettingsKeys.joinMessageChannel || key === SettingsKeys.leaveMessageChannel) {
			return { value: (value as Channel).id };
		}

		return { value };
	}

	private fromDbValue(key: SettingsKeys, value: string): string {
		if (value === undefined || value === null) {
			return value;
		}

		if (key === SettingsKeys.joinMessageChannel || key === SettingsKeys.leaveMessageChannel) {
			return `<#${value}>`;
		}
		return value;
	}
}
