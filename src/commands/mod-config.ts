import { Channel, Guild, RichEmbed, User } from 'discord.js';
import { Command, CommandDecorators, Logger, logger, Message, Middleware } from 'yamdbf';

import { IMClient } from '../client';
import { settings, SettingsKeys } from '../sequelize';
import { createEmbed } from '../utils/util';

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
			aliases: ['set', 'get', 'show-config', 'showConfig', 'changeConfig', 'change-config'],
			desc: 'Show and change the config of the server',
			usage: '<prefix>config (key (value))',
			callerPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
			hidden: true,
			guildOnly: true
		});
	}

	@using(checkArgsMiddleware(resolve))
	@using(checkArgsMiddleware(expect))
	public async action(message: Message, [key, rawValue]: [SettingsKeys, any]): Promise<any> {
		this._logger.log(`${message.guild.name} (${message.author.username}): ${message.content}`);

		if (key) {
			const sets = message.guild.storage.settings;
			const val = this.fromDbValue(key, await sets.get(key));

			if (rawValue) {
				const isNone = rawValue === 'none' || rawValue === 'empty' || rawValue === 'null';
				const parsedValue = isNone ? null : this.toDbValue(message.guild, key, rawValue);
				if (!parsedValue.value) {
					message.channel.send(parsedValue.error);
					return;
				}

				const value = parsedValue.value;

				// Set the setting through our storage provider
				await message.guild.storage.settings.set(key, value);

				// Set new value
				sets.set(key, value);

				if (val) {
					message.channel.send(`Changed **${key}** from **${val}** to **${rawValue}**`);
				} else {
					message.channel.send(`Set **${key}** to **${rawValue}**`);
				}
			} else {
				if (!val) {
					message.channel.send(`Config **${key}** is not set.`);
				} else {
					message.channel.send(`Config **${key}** is set to **${val}**`);
				}
			}
		} else {
			const sets = await settings.findAll({
				where: {
					guildId: message.guild.id,
				}
			});

			const embed = new RichEmbed();

			sets.forEach(set => {
				embed.addField(set.key, this.fromDbValue(set.key, set.value));
			});

			createEmbed(message.client, embed);
			message.channel.send({ embed });
		}
	}

	private toDbValue(guild: Guild, key: SettingsKeys, value: any): { value?: string, error?: string } {
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
